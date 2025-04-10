import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'booking_details.dart';

class BookingHistory extends StatefulWidget {
  const BookingHistory({super.key});

  @override
  State<BookingHistory> createState() => _BookingHistoryState();
}

class _BookingHistoryState extends State<BookingHistory> {
  String selectedTimeFrame = 'Today';
  String selectedStatus = 'Upcoming';

  List<Map<String, String>> bookings = [
    {'title': 'Futsal Match 1', 'status': 'Upcoming', 'date': '2025-02-17', 'time': '10:00 AM'},
    {'title': 'Futsal Match 2', 'status': 'Cancelled', 'date': '2025-02-15', 'time': '02:00 PM'},
    {'title': 'Futsal Match 3', 'status': 'Completed', 'date': '2025-02-16', 'time': '11:00 AM'},
    {'title': 'Futsal Match 4', 'status': 'Upcoming', 'date': '2025-02-20', 'time': '01:00 PM'},
  ];

  DateTime _getStartDate(String timeframe) {
    DateTime now = DateTime.now();
    switch (timeframe) {
      case 'Today': return now;
      case '1 Week': return now.subtract(const Duration(days: 7));
      case '1 Month': return DateTime(now.year, now.month - 1, now.day);
      case '1 Year': return DateTime(now.year - 1, now.month, now.day);
      default: return now;
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
    final filteredBookings = _filterBookings();

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Bookings'),
        centerTitle: true,
        backgroundColor: Colors.teal,
        automaticallyImplyLeading: false,
      ),
      body: Column(
        children: [
          // Filters
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                _buildDropdown('Time', selectedTimeFrame, ['Today', '1 Week', '1 Month', '1 Year'], (val) {
                  setState(() => selectedTimeFrame = val!);
                }),
                const SizedBox(width: 12),
                _buildDropdown('Status', selectedStatus, ['Upcoming', 'Completed', 'Cancelled'], (val) {
                  setState(() => selectedStatus = val!);
                }),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: filteredBookings.length,
              itemBuilder: (context, index) {
                final booking = filteredBookings[index];
                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => Bookingdetails(booking: booking)),
                    );
                  },
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        const BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 3))
                      ],
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.sports_soccer, size: 36, color: Colors.teal),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                booking['title']!,
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                '${booking['date']} at ${booking['time']}',
                                style: TextStyle(color: Colors.grey[600]),
                              ),
                            ],
                          ),
                        ),
                        _buildStatusChip(booking['status']!),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      backgroundColor: const Color(0xFFF4F4F4),
    );
  }

  Widget _buildDropdown(String label, String value, List<String> items, ValueChanged<String?> onChanged) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: Colors.teal, width: 1.2),
          borderRadius: BorderRadius.circular(12),
        ),
        child: DropdownButton<String>(
          value: value,
          isExpanded: true,
          underline: const SizedBox.shrink(),
          onChanged: onChanged,
          items: items.map((item) => DropdownMenuItem(value: item, child: Text(item))).toList(),
        ),
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    IconData icon;

    switch (status) {
      case 'Upcoming':
        color = Colors.blue;
        icon = Icons.schedule;
        break;
      case 'Completed':
        color = Colors.green;
        icon = Icons.check_circle_outline;
        break;
      case 'Cancelled':
        color = Colors.red;
        icon = Icons.cancel_outlined;
        break;
      default:
        color = Colors.grey;
        icon = Icons.help_outline;
    }

    return Chip(
      avatar: Icon(icon, size: 16, color: Colors.white),
      label: Text(status, style: const TextStyle(color: Colors.white)),
      backgroundColor: color,
    );
  }
}
