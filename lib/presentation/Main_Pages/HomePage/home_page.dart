import 'package:flutter/material.dart';
import 'package:player/core/config/theme/app_colors.dart';
import '../HomePage/popular_futsal.dart';
import '../HomePage/nearby_futsal.dart';
import '../HomePage/futsal_detail_screen.dart';
//notification set up to work on

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          // SliverAppBar: Fixed header with collapsible effect
          SliverAppBar(
            expandedHeight: 300,
            floating: false,
            pinned: true,  // Keeps the header visible when scrolled
            automaticallyImplyLeading: false,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  color: Colors.green,
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(20),
                    bottomRight: Radius.circular(20),
                  ),
                ),
                padding: const EdgeInsets.only(
                    top: 50, left: 16, right: 16, bottom: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Row for profile and notification icons
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            CircleAvatar(
                              backgroundColor: Colors.white,
                              child: Icon(Icons.person, color: Colors.green),
                            ),
                            SizedBox(width: 8),
                            Text(
                              "Hello, Dinesh!",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.notifications, color: Colors.white),
                          iconSize: 40.0,
                          onPressed: () {
                            // Handle notification click
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 40),
                    // Title
                    const Center(
                      child: Text(
                        "Find Futsal !",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Search Bar
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: Colors.white,
                              hintText: "Search your futsal!",
                              prefixIcon: const Icon(Icons.search, color: Colors.grey),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(30),
                                borderSide: BorderSide.none,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Container(
                          height: 50,
                          width: 50,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(30),
                          ),
                          child: IconButton(
                            icon: const Icon(Icons.filter_alt, color: Colors.green),
                            onPressed: () {
                              // Handle filter click
                            },
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
          // Content Section (Popular Futsals, Nearby Futsals, etc.)
          SliverList(
            delegate: SliverChildListDelegate([
              const SizedBox(height:40),
              _buildFutsalSection(
                title: "Popular Futsal",
                context: context,
                navigateTo:  const PopularFutsalPage(),
              ),
              const SizedBox(height: 5),
              _buildFutsalSection(
                title: "Nearby Futsal",
                context: context,
                navigateTo:  const NearbyFutsalPage(),
              ),
            ]),
          ),
        ],
      ),
    );
  }

  Widget _buildFutsalSection({
    required String title,
    required BuildContext context,
    required Widget navigateTo,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => navigateTo),
                  );
                },
                child: const Text("View more", style: TextStyle(color: Colors.green)),
              ),
            ],
          ),
          SizedBox(
            height: 250,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                FutsalCard(
                  name: "Hariyali Futsal",
                  location: "Satungal, KTM",
                  price: 1200,
                  imageUrl: "assets/images/futsal_pitch.jpg",
                  onTap: () => _navigateToDetail(context, "Hariyali Futsal"),
                ),
                FutsalCard(
                  name: "Green Turf",
                  location: "Lalitpur",
                  price: 1500,
                  imageUrl: "assets/images/futsal_pitch.jpg",
                  onTap: () => _navigateToDetail(context, "Green Turf"),
                ),
                FutsalCard(
                  name: "Champion Arena",
                  location: "Bhaktapur",
                  price: 1300,
                  imageUrl: "assets/images/futsal_pitch.jpg",
                  onTap: () => _navigateToDetail(context, "Champion Arena"),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _navigateToDetail(BuildContext context, String futsalName) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FutsalDetailScreen(futsalName: futsalName),
      ),
    );
  }
}

class FutsalCard extends StatelessWidget {
  final String name;
  final String location;
  final int price;
  final String imageUrl;
  final VoidCallback onTap;

  const FutsalCard({
    super.key,
    required this.name,
    required this.location,
    required this.price,
    required this.imageUrl,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 200,
        margin: const EdgeInsets.only(right: 10),
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              // ignore: deprecated_member_use
              color: AppColors.primary.withOpacity(0.3),
              blurRadius: 5,
              spreadRadius: 2,
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.asset(
                imageUrl,
                width: double.infinity,
                height: 120,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            Text(
              location,
              style: TextStyle(color: Colors.grey[700], fontSize: 14),
            ),
            const SizedBox(height: 5),
            const Text(
              "Availability: Yes",
              style: TextStyle(color: Colors.green, fontSize: 14),
            ),
            Text(
              "Price: NPR $price",
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }
}
