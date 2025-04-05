import 'package:flutter/material.dart';
import '../HomePage/futsal_detail_screen.dart';

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
          "Nearby Futsal",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.green,
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(10),
        children: [
          FutsalCard(
            name: "Dreamer's Futsal",
            location: "Satungal, KTM",
            price: 10,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
            onTap: () => _navigateToDetail(context, "Dreamer's Futsal"),
          ),
          FutsalCard(
            name: "Green Field Futsal",
            location: "Lalitpur",
            price: 1300,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
            onTap: () => _navigateToDetail(context, "Green Field Futsal"),
          ),
          FutsalCard(
            name: "Champion's Arena",
            location: "Bhaktapur",
            price: 1400,
            availability: "No",
            imageUrl: "assets/images/futsal_pitch.jpg",
            onTap: () => _navigateToDetail(context, "Champion's Arena"),
          ),
          FutsalCard(
            name: "Sports Hub",
            location: "Baneshwor",
            price: 1500,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
            onTap: () => _navigateToDetail(context, "Sports Hub"),
          ),
          FutsalCard(
            name: "Goal Zone",
            location: "Tinkune",
            price: 1200,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
            onTap: () => _navigateToDetail(context, "Goal Zone"),
          ),
          FutsalCard(
            name: "Victory Ground",
            location: "Koteshwor",
            price: 1300,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
            onTap: () => _navigateToDetail(context, "Victory Ground"),
          ),
          FutsalCard(
            name: "Striker's Paradise",
            location: "Thimi",
            price: 1100,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
            onTap: () => _navigateToDetail(context, "Striker's Paradise"),
          ),
          FutsalCard(
            name: "Football Factory",
            location: "Balaju",
            price: 1250,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
            onTap: () => _navigateToDetail(context, "Football Factory"),
          ),
          FutsalCard(
            name: "Play Arena",
            location: "Kalanki",
            price: 1350,
            availability: "No",
            imageUrl: "assets/images/futsal_pitch.jpg",
            onTap: () => _navigateToDetail(context, "Play Arena"),
          ),
          FutsalCard(
            name: "Soccer Stars",
            location: "Chabahil",
            price: 1150,
            availability: "Yes",
            imageUrl: "assets/images/futsal_pitch.jpg",
            onTap: () => _navigateToDetail(context, "Soccer Stars"),
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
  final String availability;
  final String imageUrl;
  final VoidCallback onTap;

  const FutsalCard({
    super.key,
    required this.name,
    required this.location,
    required this.price,
    required this.availability,
    required this.imageUrl,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
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
      ),
    );
  }
}