import 'package:flutter/material.dart';

class PopularFutsalPage extends StatelessWidget {
  const PopularFutsalPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Popular Futsal"),
        backgroundColor: Colors.green,
      ),
      body: ListView(
        children: [
          const FutsalCard(name: "Hariyali Futsal", location: "Satungal, KTM", price: 1200),
          const FutsalCard(name: "Green Turf", location: "Lalitpur", price: 1500),
          const FutsalCard(name: "Champion Arena", location: "Bhaktapur", price: 1300),
          const FutsalCard(name: "Champion Arena", location: "Bhaktapur", price: 1300),
          const FutsalCard(name: "Champion Arena", location: "Bhaktapur", price: 1300),
          const FutsalCard(name: "Champion Arena", location: "Bhaktapur", price: 1300),
          const FutsalCard(name: "Champion Arena", location: "Bhaktapur", price: 1300),
          const FutsalCard(name: "Champion Arena", location: "Bhaktapur", price: 1300),
          const FutsalCard(name: "Champion Arena", location: "Bhaktapur", price: 1300),
          const FutsalCard(name: "Champion Arena", location: "Bhaktapur", price: 1300),
          // Add more futsal cards here
        ],
      ),
    );
  }
}
//futal card
class FutsalCard extends StatelessWidget {
  final String name;
  final String location;
  final int price;
  final String imageUrl; // Optional image for background

  const FutsalCard({
    super.key,
    required this.name,
    required this.location,
    required this.price,
    this.imageUrl = '', // Default to empty if no image
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(12),
      elevation: 8,  // Add shadow to make the card stand out
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),  // Rounded corners
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          children: [
            // Background image or color
            if (imageUrl.isNotEmpty)
              Image.network(
                imageUrl, // Use image URL or local asset
                height: 160,
                width: double.infinity,
                fit: BoxFit.cover,
              )
            else
              Container(
                height: 160,
                width: double.infinity,
                color: Colors.green,  // Fallback color if no image
              ),
            // Content overlay
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.black.withOpacity(0.4), Colors.transparent],
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                  ),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(20),
                    bottomRight: Radius.circular(20),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Name
                    Text(
                      name,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    // Location
                    Text(
                      location,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 8),
                    // Price and Availability
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Price: NPR $price",
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: Colors.white,
                          ),
                        ),
                        // Add availability icon
                        const Icon(
                          Icons.check_circle,
                          color: Colors.green,
                          size: 18,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
