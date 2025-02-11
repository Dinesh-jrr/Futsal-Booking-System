import 'package:flutter/material.dart';
import 'popularFutsal.dart'; // Import the Popular Futsal page
import 'nearbyFutsal.dart';  // Import the Nearby Futsal page

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Top Header Section
            Container(
              height: 300,
              decoration: const BoxDecoration(
                color: Colors.green,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(20),
                  bottomRight: Radius.circular(20),
                ),
              ),
              padding: const EdgeInsets.only(top: 50, left: 16, right: 16, bottom: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Row for profile and notification icons
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const CircleAvatar(
                            backgroundColor: Colors.white,
                            child: Icon(Icons.person, color: Colors.green),
                          ),
                          const SizedBox(width: 8),
                          const Text(
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
                        icon: const Icon(Icons.notifications, color: Colors.white),iconSize: 40.0,
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
            const SizedBox(height: 20),

            // Popular Futsal Section
            _buildFutsalSection(title: "Popular Futsal", context: context,navigateTo: const PopularFutsalPage(),),
            const SizedBox(height: 20),

            // Nearby Futsal Section
            _buildFutsalSection(title: "Nearby Futsal", context: context,navigateTo: const NearbyFutsalPage(),),
          ],
        ),
      ),
    );
  }

  // Function to build the futsal section
  Widget _buildFutsalSection({required String title, required BuildContext context, required Widget navigateTo}) {
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
                  // Handle View More navigation
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
            height: 200, // Set height for horizontal scroll
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                FutsalCard(name: "Hariyali Futsal", location: "Satungal, KTM", price: 1200),
                FutsalCard(name: "Green Turf", location: "Lalitpur", price: 1500),
                FutsalCard(name: "Champion Arena", location: "Bhaktapur", price: 1300),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class FutsalCard extends StatelessWidget {
  final String name;
  final String location;
  final int price;

  const FutsalCard({
    super.key,
    required this.name,
    required this.location,
    required this.price,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      height: 500,
      margin: const EdgeInsets.only(right: 10),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.grey[300],
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min, // Prevents Column from expanding unnecessarily
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Placeholder for futsal image
          Container(
            height: 50,
            width: 50,
            color: Colors.green,
          ),
          const SizedBox(height: 8),
          Text(
            name,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          Text(location, style: TextStyle(color: Colors.grey[700])),
          const SizedBox(height: 5),
          const Text("Availability: Yes", style: TextStyle(color: Colors.green)),
          Text("Price: NPR $price", style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

