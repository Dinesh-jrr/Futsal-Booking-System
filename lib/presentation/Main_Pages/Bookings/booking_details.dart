import 'package:flutter/material.dart';

class Bookingdetails extends StatelessWidget {
  final Map<String, dynamic> booking;

  const Bookingdetails({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor(booking['status'] ?? 'Unknown');
    final statusIcon = _getStatusIcon(booking['status'] ?? 'Unknown');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Booking Details'),
        backgroundColor: Colors.teal,
        centerTitle: true,
      ),
      backgroundColor: const Color(0xFFF4F4F4),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              // Booking Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: const [
                    BoxShadow(
                      blurRadius: 10,
                      color: Colors.black12,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Title
                    Row(
                      children: [
                        const Icon(Icons.sports_soccer, size: 32, color: Colors.teal),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            booking['futsalName'] ?? 'Futsal Match',
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Date & Time
                    Row(
                      children: [
                        const Icon(Icons.calendar_today, size: 20, color: Colors.grey),
                        const SizedBox(width: 8),
                        Text(
                          booking['date'] ?? 'N/A',
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(width: 20),
                        const Icon(Icons.access_time, size: 20, color: Colors.grey),
                        const SizedBox(width: 8),
                        Text(
                          booking['timeSlot'] ?? 'N/A',
                          style: const TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Status
                    Row(
                      children: [
                        Chip(
                          avatar: Icon(statusIcon, color: Colors.white, size: 18),
                          label: Text(
                            booking['status'] ?? 'Unknown',
                            style: const TextStyle(color: Colors.white),
                          ),
                          backgroundColor: statusColor,
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 30),

              // Static Instructions Section
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.teal[50],
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Match Details',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                    ),
                    SizedBox(height: 10),
                    Text(
                      'This is a friendly futsal match. Be on time and bring your futsal shoes. The venue will provide bibs and water. Make sure to warm up before the game!',
                      style: TextStyle(fontSize: 15, color: Colors.black87, height: 1.4),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

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

  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'Upcoming':
        return Icons.schedule;
      case 'Completed':
        return Icons.check_circle_outline;
      case 'Cancelled':
        return Icons.cancel_outlined;
      default:
        return Icons.help_outline;
    }
  }
}
