import 'package:flutter/material.dart';

class NearbyFutsalPage extends StatelessWidget {
  const NearbyFutsalPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Nearby Futsal"),
        backgroundColor: Colors.green,
      ),
      body: ListView(
        children: [
          FutsalCard(name: "Local Futsal A", location: "Kathmandu", price: 1000),
          FutsalCard(name: "Local Futsal B", location: "Lalitpur", price: 1200),
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

  const FutsalCard({
    super.key,
    required this.name,
    required this.location,
    required this.price,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(10),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
            Text(location, style: TextStyle(color: Colors.grey[700])),
            Text("Price: NPR $price", style: const TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
