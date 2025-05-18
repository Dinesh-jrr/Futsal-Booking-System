import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:player/core/config/constants.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:http/http.dart' as http;
import 'package:player/core/theme/app_colors.dart';
import 'package:player/presentation/Main_Pages/HomePage/book_now.dart';

class FutsalDetailScreen extends StatefulWidget {
  final String futsalId;

  const FutsalDetailScreen({Key? key, required this.futsalId})
      : super(key: key);

  @override
  State<FutsalDetailScreen> createState() => _FutsalDetailScreenState();
}

class _FutsalDetailScreenState extends State<FutsalDetailScreen> {
  DateTime _selectedDay = DateTime.now();
  DateTime _focusedDay = DateTime.now();
  String? _selectedTimeSlot;

  List<String> images = [];
  List<String> timeSlots = [];
  Set<String> bookedSlots = {};
  String futsalName = '';
  String description = '';
  double price = 0;
  LatLng? futsalLocation;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchFutsalDetails();
    fetchBookedSlotsForDay();
  }

  Future<void> fetchFutsalDetails() async {
    try {
      final response = await http.get(
        Uri.parse('${AppConfig.baseUrl}/api/getOnefutsal/${widget.futsalId}'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body)['futsal'];

        setState(() {
          futsalName = data['futsalName'] ?? '';
          images = List<String>.from(data['images'] ?? []);
          timeSlots = List<String>.from(data['availableTimeSlots'] ?? []);
          description = data['description'] ?? '';
          price = (data['pricePerHour'] ?? 0).toDouble();
          final coordinates = data['coordinates'];
          if (coordinates != null) {
            futsalLocation = LatLng(
              coordinates['lat'] ?? 27.7172,
              coordinates['lng'] ?? 85.3240,
            );
          } else {
            futsalLocation = const LatLng(27.7172, 85.3240);
          }
          isLoading = false;
        });
      } else {
        print('Failed to load futsal details');
      }
    } catch (e) {
      print('Error fetching futsal details: $e');
    }
  }

  Future<void> fetchBookedSlotsForDay() async {
    try {
      final formattedDate =
          "${_selectedDay.year}-${_selectedDay.month.toString().padLeft(2, '0')}-${_selectedDay.day.toString().padLeft(2, '0')}";
      final response = await http.get(
        Uri.parse(
            '${AppConfig.baseUrl}/api/bookedslots/${widget.futsalId}/$formattedDate'),
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          bookedSlots = Set<String>.from(data['bookedSlots'] ?? []);
        });
      } else {
        print('Failed to load booked slots');
      }
    } catch (e) {
      print('Error fetching booked slots: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SafeArea(
              child: CustomScrollView(
                slivers: [
                  SliverAppBar(
                    pinned: true,
                    expandedHeight: 120,
                    backgroundColor: Colors.green,
                    automaticallyImplyLeading: false,
                    flexibleSpace: FlexibleSpaceBar(
                      title: Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.arrow_back,
                                color: Colors.white),
                            onPressed: () => Navigator.pop(context),
                          ),
                          Expanded(
                            child: Text(
                              futsalName,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.favorite_border,
                                color: Colors.white),
                            onPressed: () {},
                          ),
                          IconButton(
                            icon: const Icon(Icons.share, color: Colors.white),
                            onPressed: () {},
                          ),
                        ],
                      ),
                    ),
                  ),
                  SliverList(
                    delegate: SliverChildListDelegate(
                      [
                        _buildImageGallery(),
                        _buildRatingAndReviews(),
                        _buildDescription(),
                        _buildCalendar(),
                        _buildTimeSlots(),
                        _buildBookButton(),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildImageGallery() {
    return images.isEmpty
        ? const SizedBox.shrink()
        : Column(
            children: [
              SizedBox(
                height: 200,
                child: PageView.builder(
                  itemCount: images.length,
                  itemBuilder: (context, index) {
                    return Image.network(
                      images[index],
                      width: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          const Center(
                        child: Icon(Icons.broken_image,
                            size: 120, color: Colors.grey),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
  }

  Widget _buildRatingAndReviews() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Ratings & Reviews',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          RatingBarIndicator(
            rating: 4.5,
            itemBuilder: (context, _) =>
                const Icon(Icons.star, color: Colors.amber),
            itemCount: 5,
            itemSize: 24,
          ),
        ],
      ),
    );
  }

  Widget _buildDescription() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('About',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(description,
              style: TextStyle(color: Colors.grey[600], height: 1.5)),
        ],
      ),
    );
  }

  Widget _buildCalendar() {
    return TableCalendar(
      firstDay: DateTime.now(),
      lastDay: DateTime.now().add(const Duration(days: 30)),
      focusedDay: _focusedDay,
      selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
      onDaySelected: (selectedDay, focusedDay) {
        setState(() {
          _selectedDay = selectedDay;
          _focusedDay = focusedDay;
        });
        fetchBookedSlotsForDay();
      },
      calendarStyle: const CalendarStyle(
        selectedDecoration:
            BoxDecoration(color: Colors.green, shape: BoxShape.circle),
        todayDecoration:
            BoxDecoration(color: Colors.greenAccent, shape: BoxShape.circle),
      ),
    );
  }

  Widget _buildTimeSlots() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Available Time Slots',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: timeSlots.map((time) {
              final isBooked = bookedSlots.contains(time);
              final isSelected = _selectedTimeSlot == time;

              return AbsorbPointer(
                absorbing: isBooked,
                child: Opacity(
                  opacity: isBooked ? 0.5 : 1.0,
                  child: InkWell(
                    onTap: () => setState(() => _selectedTimeSlot = time),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: isBooked
                            ? Colors.grey[300]
                            : (isSelected ? Colors.green : Colors.white),
                        border: Border.all(
                            color: isBooked ? Colors.red : Colors.green),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            time,
                            style: TextStyle(
                              color: isBooked
                                  ? Colors.red
                                  : (isSelected ? Colors.white : Colors.green),
                            ),
                          ),
                          if (isBooked) ...[
                            const SizedBox(width: 6),
                            const Icon(Icons.lock,
                                size: 16, color: Colors.red),
                          ]
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildBookButton() {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: ElevatedButton(
        onPressed: _selectedTimeSlot == null
            ? null
            : () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => BookNow(
                      futsalId: widget.futsalId,
                      futsalName: futsalName,
                      selectedDay: _selectedDay,
                      selectedTimeSlot: _selectedTimeSlot!,
                      totalCost: price,
                    ),
                  ),
                ),
        style: ElevatedButton.styleFrom(
          backgroundColor:
              _selectedTimeSlot == null ? Colors.grey : AppColors.primary,
          padding: const EdgeInsets.symmetric(vertical: 24.0),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
        ),
        child: const Text(
          "Book Now",
          style: TextStyle(
              fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
    );
  }
}
