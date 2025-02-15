import 'package:flutter/material.dart';

class NearbyFutsalPage extends StatelessWidget {
  const NearbyFutsalPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Popular Futsal",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.green,
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(10),
        children: [
          FutsalCard(
            name: "Dreamer’s Futsal",
            location: "Satungal, KTM",
            price: 1200,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
          ),
          FutsalCard(
            name: "Dreamer’s Futsal",
            location: "Satungal, KTM",
            price: 1200,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
          ),
          FutsalCard(
            name: "Dreamer’s Futsal",
            location: "Satungal, KTM",
            price: 1200,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
          ),
          FutsalCard(
            name: "Dreamer’s Futsal",
            location: "Satungal, KTM",
            price: 1200,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
          ),
          FutsalCard(
            name: "Dreamer’s Futsal",
            location: "Satungal, KTM",
            price: 1200,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
          ),
          FutsalCard(
            name: "Dreamer’s Futsal",
            location: "Satungal, KTM",
            price: 1200,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
          ),
          FutsalCard(
            name: "Dreamer’s Futsal",
            location: "Satungal, KTM",
            price: 1200,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
          ),
          FutsalCard(
            name: "Dreamer’s Futsal",
            location: "Satungal, KTM",
            price: 1200,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
          ),

          FutsalCard(
            name: "Dreamer’s Futsal",
            location: "Satungal, KTM",
            price: 1200,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
          ),
          FutsalCard(
            name: "Dreamer’s Futsal",
            location: "Satungal, KTM",
            price: 1200,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
          ),
          // Add more futsal cards here
        ],
      ),
    );
  }
}

class FutsalCard extends StatelessWidget {
  final String name;
  final String location;
  final int price;
  final String availability;
  final String imageUrl;

  const FutsalCard({
    super.key,
    required this.name,
    required this.location,
    required this.price,
    required this.availability,
    required this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
        side: BorderSide(color: Colors.green.shade300, width: 1),
      ),
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 5),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    location,
                    style: TextStyle(color: Colors.grey[700], fontSize: 14),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Text(
                        "Availability: ",
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        availability,
                        style: TextStyle(
                          fontSize: 14,
                          color: availability == "Yes" ? Colors.green : Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Price: NPR $price",
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 10),
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.asset(
                imageUrl,
                width: 80,
                height: 60,
                fit: BoxFit.cover,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
