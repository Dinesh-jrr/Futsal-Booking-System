import 'package:flutter/material.dart';

class PopularFutsalPage extends StatelessWidget {
  const PopularFutsalPage({super.key});

  // Default popular futsal list
  static final List<Map<String, dynamic>> popularFutsalList = [
    {
      "name": "Dreamer’s Futsal",
      "location": "Satungal, KTM",
      "price": 1200,
      "availability": "Yes",
      "imageUrl": "assets/images/futsal_pitch.jpg",
    },
    {
      "name": "Champion Futsal",
      "location": "Lalitpur",
      "price": 1400,
      "availability": "Yes",
      "imageUrl": "assets/images/futsal_pitch.jpg",
    },
    {
      "name": "Arena Turf",
      "location": "Bhaktapur",
      "price": 1300,
      "availability": "Yes",
      "imageUrl": "assets/images/futsal_pitch.jpg",
    },
    // Duplicating some entries for default UI
    for (int i = 0; i < 5; i++)
      {
        "name": "Dreamer’s Futsal",
        "location": "Satungal, KTM",
        "price": 1200,
        "availability": "Yes",
        "imageUrl": "assets/images/futsal_pitch.jpg",
      },
  ];

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
      body: ListView.builder(
        padding: const EdgeInsets.all(10),
        itemCount: popularFutsalList.length,
        itemBuilder: (context, index) {
          final futsal = popularFutsalList[index];
          return FutsalCard(
            name: futsal["name"],
            location: futsal["location"],
            price: futsal["price"],
            availability: futsal["availability"],
            imageUrl: futsal["imageUrl"],
          );
        },
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
                      const Text(
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
