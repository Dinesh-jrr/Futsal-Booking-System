import 'package:flutter/material.dart';
import 'package:user/core/config/theme/app_colors.dart';

class BookNow extends StatelessWidget {
  final String futsalName;
  final DateTime selectedDay;
  final String? selectedTimeSlot;

  const BookNow({
    Key? key,
    required this.futsalName,
    required this.selectedDay,
    required this.selectedTimeSlot,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double totalCost = 1000.00; // Example cost
    double advancePayment = totalCost * 0.2;

    return Scaffold(
      appBar: AppBar(
        title: Text("Booking Details"),
        backgroundColor: Colors.green,
        elevation: 0,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                _buildSectionHeader('Futsal Information'),
                _buildInfoCard(
                  title: 'Futsal: $futsalName',
                  subtitle: 'Date: ${selectedDay.toLocal()}',
                  content: 'Time: $selectedTimeSlot',
                ),
                SizedBox(height: 16),
                _buildSectionHeader('Cost Breakdown'),
                _buildCostCard(
                  totalCost: totalCost,
                  advancePayment: advancePayment,
                ),
                SizedBox(height: 16),
                _buildSectionHeader('Payment'),
                _buildPaymentConfirmation(context, advancePayment),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.bold,
          color: Colors.green,
        ),
      ),
    );
  }

  Widget _buildInfoCard({required String title, required String subtitle, required String content}) {
    return Container(
      width: double.infinity, // Increased width
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              SizedBox(height: 8),
              Text(subtitle, style: TextStyle(fontSize: 16)),
              SizedBox(height: 8),
              Text(content, style: TextStyle(fontSize: 16)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCostCard({required double totalCost, required double advancePayment}) {
    return Container(
      width: double.infinity, // Increased width
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        color: Colors.green[50],
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text('Total Cost: \NPR${totalCost.toStringAsFixed(2)}', style: TextStyle(fontSize: 16)),
              SizedBox(height: 8),
              Text('Advance Payment (20%): \NPR${advancePayment.toStringAsFixed(2)}', style: TextStyle(fontSize: 16)),
            ],
          ),
        ),
      ),
    );
  }

 Widget _buildPaymentConfirmation(BuildContext context, double advancePayment) {
  return Container(
    width: double.infinity, // Increased width
    child: Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text('You are paying', style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text('\NPR${advancePayment.toStringAsFixed(2)}', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            SizedBox(height: 16),
            Text('Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('Futsal: $futsalName', style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text('Date: ${selectedDay.toLocal()}', style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text('Time: $selectedTimeSlot', style: TextStyle(fontSize: 16)),
            SizedBox(height: 16),
            Text('Your Bill', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('Total Paying Amount: \NPR${advancePayment.toStringAsFixed(2)}', style: TextStyle(fontSize: 16)),
            SizedBox(height: 16),
            // Wrap the button in a SizedBox to set width
            SizedBox(
              width: double.infinity, // Set width to fill the parent container
              child: ElevatedButton(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text("Payment Confirmed", style: TextStyle(color: Colors.green)),
                      content: const Text("Your advance payment has been received."),
                      actions: <Widget>[
                        TextButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          child: const Text("OK"),
                        ),
                      ],
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 24.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
                child: const Text(
                  "Confirm",
                  style: TextStyle(
                    fontFamily: 'Roboto',
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
}