import 'package:flutter/material.dart';

class BookingDetails extends StatelessWidget {
  final Map<String, String> booking;

  BookingDetails({required this.booking});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Booking Details'),
        backgroundColor: Colors.green,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Match Title: ${booking['title']}',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Text('Date: ${booking['date']}', style: TextStyle(fontSize: 18)),
            Text('Time: ${booking['time']}', style: TextStyle(fontSize: 18)),
            SizedBox(height: 20),
            Chip(
              label: Text(
                booking['status']!,
                style: TextStyle(color: Colors.white),
              ),
              backgroundColor: _getStatusColor(booking['status']!),
            ),
            SizedBox(height: 20),
            Text(
              'More details about the match can go here...',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }

  // Helper method to get the status color
  Color _getStatusColor(String status) {
    switch (status) {
      case 'Upcoming':
        return Colors.blue;
      case 'Completed':
        return Colors.green;
      case 'Cancelled':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
