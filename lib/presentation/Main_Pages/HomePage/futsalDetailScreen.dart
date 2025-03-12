import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:user/core/config/theme/app_colors.dart';
import 'package:user/presentation/Main_Pages/HomePage/bookNow.dart';

class FutsalDetailScreen extends StatefulWidget {
  final String futsalName;

  const FutsalDetailScreen({
    super.key,
    required this.futsalName,
  });

  @override
  State<FutsalDetailScreen> createState() => _FutsalDetailScreenState();
}

class _FutsalDetailScreenState extends State<FutsalDetailScreen> {
  DateTime _selectedDay = DateTime.now();
  DateTime _focusedDay = DateTime.now();
  String? _selectedTimeSlot;
  //late GoogleMapController _mapController;

  // Sample images - Replace with actual images from the backend
  final List<String> images = [
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1518604666860-9ed391f76460?ixlib=rb-4.0.3',
  ];

  final List<String> timeSlots = [
    '6:00-7:00 am',
    '7:00-8:00 am',
    '8:00-9:00 am',
    '9:00-10:00 am',
    '10:00-11:00 am',
    '11:00-12:00 am',
    '12:00-1:00 pm',
    '1:00-2:00 pm',
    '2:00-3:00 pm',
    '3:00-4:00 pm',
    '4:00-5:00 pm',
    '5:00-6:00 pm',
    '6:00-7:00 pm',
    '7:00-8:00 pm',
  ];

  // Sample location
  final LatLng futsalLocation = const LatLng(27.7172, 85.3240);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
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
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                    Expanded(
                      child: Text(
                        widget.futsalName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.favorite_border, color: Colors.white),
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
  return Column(
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
            );
          },
        ),
      ),
      Row(
        mainAxisAlignment: MainAxisAlignment.end, // Aligns the button to the right
        children: [
          TextButton(
            onPressed: () {},
            child: const Text(
              'See all',
              style: TextStyle(color: Colors.green),
            ),
          ),
        ],
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
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  RatingBarIndicator(
                    rating: 4.5, // Example rating
                    itemBuilder: (context, index) => const Icon(
                      Icons.star,
                      color: Colors.amber,
                    ),
                    itemCount: 5,
                    itemSize: 24,
                    direction: Axis.horizontal,
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    '4.5 (120 reviews)',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
              TextButton(
                onPressed: () {},
                child: const Text(
                  'See all',
                  style: TextStyle(color: Colors.green),
                ),
              ),
            ],
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
          const Text(
            'About',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            'Welcome to ${widget.futsalName}, your premier destination for indoor football in Kathmandu. We provide high-quality facilities with FIFA-standard artificial turf.',
            style: TextStyle(color: Colors.grey[600], height: 1.5),
          ),
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
      },
      calendarStyle: const CalendarStyle(
        selectedDecoration: BoxDecoration(
          color: Colors.green,
          shape: BoxShape.circle,
        ),
        todayDecoration: BoxDecoration(
          color: Colors.greenAccent,
          shape: BoxShape.circle,
        ),
      ),
    );
  }

  Widget _buildTimeSlots() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Available Time Slots',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: timeSlots.map((time) {
              final isSelected = _selectedTimeSlot == time;
              return InkWell(
                onTap: () {
                  setState(() {
                    _selectedTimeSlot = time;
                  });
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? Colors.green : Colors.white,
                    border: Border.all(color: Colors.green),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    time,
                    style: TextStyle(color: isSelected ? Colors.white : Colors.green),
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
          ? null  // Disables the button if no time slot is selected
          : () {
              // Navigate to the booking details screen
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => BookNow(
                    futsalName: widget.futsalName,
                    selectedDay: _selectedDay,
                    selectedTimeSlot: _selectedTimeSlot,
                  ),
                ),
              );
            },
      style: ElevatedButton.styleFrom(
        backgroundColor: _selectedTimeSlot == null
            ? Colors.grey  // Gray color when no time slot is selected
            : AppColors.primary,  // Original color when a time slot is selected
        padding: const EdgeInsets.symmetric(vertical: 24.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8.0),
        ),
      ),
      child: const Text(
        "Book Now",
        style: TextStyle(
          fontFamily: 'Roboto',
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    ),
  );
}
}