// ignore_for_file: depend_on_referenced_packages

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'booking_details.dart';

class BookingHistory extends StatefulWidget {
  const BookingHistory({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _BookingHistoryState createState() => _BookingHistoryState();
}

class _BookingHistoryState extends State<BookingHistory> {
  // Filters
  String selectedTimeFrame = 'Today';
  String selectedStatus = 'Upcoming';

  // Sample booking data (replace with data from API)
  List<Map<String, String>> bookings = [
    {
      'title': 'Futsal Match 1',
      'status': 'Upcoming',
      'date': '2025-02-17',
      'time': '10:00 AM'
    },
    {
      'title': 'Futsal Match 2',
      'status': 'Cancelled',
      'date': '2025-02-15',
      'time': '02:00 PM'
    },
    {
      'title': 'Futsal Match 3',
      'status': 'Completed',
      'date': '2025-02-16',
      'time': '11:00 AM'
    },
    {
      'title': 'Futsal Match 4',
      'status': 'Upcoming',
      'date': '2025-02-20',
      'time': '01:00 PM'
    },
  ];

  // Date filter functions
  DateTime _getStartDate(String timeframe) {
    DateTime now = DateTime.now();
    switch (timeframe) {
      case 'Today':
        return now;
      case '1 Week':
        return now.subtract(const Duration(days: 7));
      case '1 Month':
        return DateTime(now.year, now.month - 1, now.day);
      case '1 Year':
        return DateTime(now.year - 1, now.month, now.day);
      default:
        return now;
    }
  }

  List<Map<String, String>> _filterBookings() {
    DateTime startDate = _getStartDate(selectedTimeFrame);
    return bookings.where((booking) {
      DateTime bookingDate = DateFormat('yyyy-MM-dd').parse(booking['date']!);
      bool isAfterDate = bookingDate.isAfter(startDate);
      bool matchesStatus = booking['status'] == selectedStatus;
      return isAfterDate && matchesStatus;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    List<Map<String, String>> filteredBookings = _filterBookings();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Booking History'),
        centerTitle: true,
        backgroundColor: Colors.green,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.green[200]!, Colors.green[800]!],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              // Filter Section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildDropdown(
                    label: 'Time Frame',
                    value: selectedTimeFrame,
                    items: ['Today', '1 Week', '1 Month', '1 Year'],
                    onChanged: (value) {
                      setState(() {
                        selectedTimeFrame = value!;
                      });
                    },
                  ),
                  _buildDropdown(
                    label: 'Status',
                    value: selectedStatus,
                    items: ['Upcoming', 'Completed', 'Cancelled'],
                    onChanged: (value) {
                      setState(() {
                        selectedStatus = value!;
                      });
                    },
                  ),
                ],
              ),
              const SizedBox(height: 20),
              // Booking List
              Expanded(
                child: ListView.builder(
                  itemCount: filteredBookings.length,
                  itemBuilder: (context, index) {
                    Map<String, String> booking = filteredBookings[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 10.0),
                      elevation: 8.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15.0),
                      ),
                      color: Colors.white,
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(20.0),
                        title: Text(
                          booking['title']!,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.green[800],
                          ),
                        ),
                        subtitle: Text(
                          '${booking['date']} - ${booking['time']}',
                          style: TextStyle(color: Colors.grey[600]),
                        ),
                        trailing: Chip(
                          label: Text(
                            booking['status']!,
                            style: const TextStyle(color: Colors.white),
                          ),
                          backgroundColor: _getStatusColor(booking['status']!),
                        ),
                        onTap: () {
                          // Navigate to booking detail screen
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  Bookingdetails(booking: booking),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Dropdown widget
  Widget _buildDropdown({
    required String label,
    required String value,
    required List<String> items,
    required ValueChanged<String?> onChanged,
  }) {
    return Container(
      width: 150,
      padding: const EdgeInsets.symmetric(horizontal: 10.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8.0),
        border: Border.all(color: Colors.green, width: 1.5),
        boxShadow: const [BoxShadow(color: Colors.green, blurRadius: 5.0)],
      ),
      child: DropdownButton<String>(
        value: value,
        onChanged: onChanged,
        isExpanded: true,
        underline: const SizedBox(),
        items: items.map<DropdownMenuItem<String>>((String item) {
          return DropdownMenuItem<String>(
            value: item,
            child: Text(item, style: const TextStyle(color: Colors.black)),
          );
        }).toList(),
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
