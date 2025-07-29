import jsPDF from 'jspdf';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../config/firebase';

export const generateDeliveryReportPDF = async (deliveryData) => {
  try {
    // Fetch delivery rider data from Firebase - filter by store ID
    const outForDeliveryRef = collection(database, 'outForDeliveryOrders');
    const deliverySnapshot = await getDocs(outForDeliveryRef);
    const deliveryRiderData = [];
    
    deliverySnapshot.forEach((doc) => {
      const riderData = doc.data();
      // Only include riders delivering orders from this specific store
      if (deliveryData.storeInfo && 
          (riderData.restaurantId === deliveryData.storeInfo.id || 
           riderData.supplierId === deliveryData.storeInfo.id)) {
        deliveryRiderData.push({
          id: doc.id,
          ...riderData
        });
      }
    });

    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    const storeTitle = deliveryData.storeInfo ? 
      `${deliveryData.storeInfo.name} - Delivery Report` : 
      'HalalExpress Delivery Report';
    pdf.text(storeTitle, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const storeType = deliveryData.storeInfo ? 
      `${deliveryData.storeInfo.type === 'restaurant' ? 'Restaurant' : 'Supplier'} ID: ${deliveryData.storeInfo.id}` : 
      'System-wide Report';
    pdf.text(storeType, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 8;
    pdf.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 20;

    // Summary Statistics
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Summary', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Customers with Deliveries: ${deliveryData.totalCustomers}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Active Delivery Riders for this ${deliveryData.storeInfo?.type || 'store'}: ${deliveryRiderData.length}`, 20, yPosition);
    yPosition += 8;

    const totalDeliveries = deliveryData.customerRankings.reduce((sum, customer) => sum + customer.totalDeliveries, 0);
    pdf.text(`Total Completed Deliveries: ${totalDeliveries}`, 20, yPosition);
    yPosition += 8;

    const totalRevenue = deliveryData.customerRankings.reduce((sum, customer) => sum + customer.totalAmountSpent, 0);
    pdf.text(`Total Revenue from Deliveries: Php.${totalRevenue.toFixed(2)}`, 20, yPosition);
    yPosition += 20;

    // Customer Rankings
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    const rankingTitle = deliveryData.storeInfo ? 
      `Top Customers for ${deliveryData.storeInfo.name}` : 
      'Top Customers by Delivery Orders';
    pdf.text(rankingTitle, 20, yPosition);
    yPosition += 15;

    // Table headers
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    const headers = ['Rank', 'Customer', 'Phone', 'Deliveries', 'Total Spent', 'Avg Order'];
    const colWidths = [15, 35, 30, 30, 35, 35];
    let xPosition = 20;

    headers.forEach((header, index) => {
      pdf.text(header, xPosition, yPosition);
      xPosition += colWidths[index];
    });

    yPosition += 8;

    // Draw header line
    pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
    yPosition += 5;

    // Customer data
    pdf.setFont('helvetica', 'normal');
    deliveryData.customerRankings.forEach((customer, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }

      xPosition = 20;
      const rowData = [
        (index + 1).toString(),
        customer.customerName.length > 15 ? customer.customerName.substring(0, 15) + '...' : customer.customerName,
        customer.customerPhone || 'N/A',
        customer.totalDeliveries.toString(),
        `Php.${customer.totalAmountSpent.toFixed(2)}`,
        `Php.${customer.averageOrderValue.toFixed(2)}`
      ];

      rowData.forEach((data, colIndex) => {
        pdf.text(data, xPosition, yPosition);
        xPosition += colWidths[colIndex];
      });

      yPosition += 8;
    });

    // Active Delivery Riders Section
    if (deliveryRiderData.length > 0) {
      yPosition += 15;

      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      const riderSectionTitle = deliveryData.storeInfo ? 
        `Delivery Riders for ${deliveryData.storeInfo.name}` : 
        'Currently Active Delivery Riders';
      pdf.text(riderSectionTitle, 20, yPosition);
      yPosition += 15;

      // Rider table headers
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const riderHeaders = ['Rider Name', 'Phone', 'Vehicle', 'Plate #', 'Order ID'];
      const riderColWidths = [40, 30, 25, 35, 35];
      xPosition = 20;

      riderHeaders.forEach((header, index) => {
        pdf.text(header, xPosition, yPosition);
        xPosition += riderColWidths[index];
      });

      yPosition += 8;

      // Draw header line
      pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
      yPosition += 5;

      // Rider data
      pdf.setFont('helvetica', 'normal');
      deliveryRiderData.forEach((rider) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        xPosition = 20;
        const riderRowData = [
          rider.riderName || 'N/A',
          rider.riderPhone || 'N/A',
          rider.selectedVehicle || 'N/A',
          rider.plateNumber || 'N/A',
          rider.orderId || 'N/A'
        ];

        riderRowData.forEach((data, colIndex) => {
          const truncatedData = data.length > 15 ? data.substring(0, 15) + '...' : data;
          pdf.text(truncatedData, xPosition, yPosition);
          xPosition += riderColWidths[colIndex];
        });

        yPosition += 8;
      });
    }

    // Footer
    const footerY = pageHeight - 20;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Generated by HalalExpress Analytics System', pageWidth / 2, footerY, { align: 'center' });

    // Save the PDF
    const storeName = deliveryData.storeInfo ? 
      deliveryData.storeInfo.name.replace(/[^a-zA-Z0-9]/g, '_') : 
      'System';
    const fileName = `${storeName}_Delivery_Report_${new Date().getFullYear()}_${String(new Date().getMonth() + 1).padStart(2, '0')}_${String(new Date().getDate()).padStart(2, '0')}.pdf`;
    pdf.save(fileName);

    return {
      success: true,
      message: 'PDF report generated successfully!',
      fileName
    };

  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      message: 'Failed to generate PDF report',
      error: error.message
    };
  }
};

export const generateCustomerOrderHistoryPDF = async (customerOrderHistory, customerInfo, restaurantInfo) => {
  try {
    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Customer Order History Report', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Restaurant: ${restaurantInfo?.title || 'N/A'}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 20;

    // Customer Information
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Customer Information', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${customerInfo?.username || 'N/A'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Email: ${customerInfo?.email || 'N/A'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Phone: ${customerInfo?.phone || 'N/A'}`, 20, yPosition);
    yPosition += 20;

    // Order Summary Statistics
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Order Summary', 20, yPosition);
    yPosition += 10;

    const totalOrders = customerOrderHistory.length;
    const totalAmountSpent = customerOrderHistory.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalAmountSpent / totalOrders : 0;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Orders: ${totalOrders}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Total Amount Spent: Php.${totalAmountSpent.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Average Order Value: Php.${averageOrderValue.toFixed(2)}`, 20, yPosition);
    yPosition += 20;

    // Order History
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Order History', 20, yPosition);
    yPosition += 15;

    customerOrderHistory.forEach((order, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      // Order header
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Order #${index + 1}: ${order._id}`, 20, yPosition);
      yPosition += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}`, 20, yPosition);
      yPosition += 6;

      pdf.text(`Status: ${order.orderStatus}`, 20, yPosition);
      yPosition += 6;

      pdf.text(`Payment Method: ${order.paymentMethod === 'gcash' ? 'GCash' : 'Cash on Delivery'}`, 20, yPosition);
      yPosition += 6;

      pdf.text(`Payment Status: ${order.paymentStatus}`, 20, yPosition);
      yPosition += 6;

      pdf.text(`Delivery Option: ${order.deliveryOption === 'standard' ? 'For Delivery' : 'For Pickup'}`, 20, yPosition);
      yPosition += 6;

      if (order.deliveryAddress?.address) {
        const address = order.deliveryAddress.address;
        const maxWidth = pageWidth - 40; // Leave 20mm margin on each side
        const addressLines = pdf.splitTextToSize(`Delivery Address: ${address}`, maxWidth);
        
        addressLines.forEach((line) => {
          // Check if we need a new page for each line
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, 20, yPosition);
          yPosition += 6;
        });
      }

      // Order items
      pdf.text('Items:', 20, yPosition);
      yPosition += 6;

      order.orderItems?.forEach((item) => {
        const itemName = item.foodId?.title || item.productId?.title || 'Unknown Item';
        pdf.text(`  • ${item.quantity}x ${itemName} - Php.${item.totalPrice.toFixed(2)}`, 25, yPosition);
        yPosition += 5;

        // Add additives if any
        if (item.additives && item.additives.length > 0) {
          item.additives.forEach((additive) => {
            pdf.text(`    + ${additive.title}`, 30, yPosition);
            yPosition += 4;
          });
        }
      });

      // Order totals
      pdf.text(`Subtotal: Php.${order.subTotal.toFixed(2)}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Delivery Fee: Php.${order.deliveryFee.toFixed(2)}`, 20, yPosition);
      yPosition += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Total: Php.${order.totalAmount.toFixed(2)}`, 20, yPosition);
      yPosition += 6;

      if (order.orderNote) {
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Note: ${order.orderNote}`, 20, yPosition);
        yPosition += 6;
      }

      // Add some space between orders
      yPosition += 10;
      pdf.line(20, yPosition - 5, pageWidth - 20, yPosition - 5);
      yPosition += 5;
    });

    // Footer
    const footerY = pageHeight - 20;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Generated by HalalExpress Order Management System', pageWidth / 2, footerY, { align: 'center' });

    // Save the PDF
    const customerName = customerInfo?.username?.replace(/[^a-zA-Z0-9]/g, '_') || 'Customer';
    const restaurantName = restaurantInfo?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'Restaurant';
    const fileName = `${customerName}_Order_History_${restaurantName}_${new Date().getFullYear()}_${String(new Date().getMonth() + 1).padStart(2, '0')}_${String(new Date().getDate()).padStart(2, '0')}.pdf`;
    pdf.save(fileName);

    return {
      success: true,
      message: 'Customer order history PDF generated successfully!',
      fileName
    };

  } catch (error) {
    console.error('Error generating customer order history PDF:', error);
    return {
      success: false,
      message: 'Failed to generate customer order history PDF',
      error: error.message
    };
  }
};
