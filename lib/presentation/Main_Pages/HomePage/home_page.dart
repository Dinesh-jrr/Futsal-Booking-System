import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:player/core/config/constants.dart';
import 'package:player/presentation/Main_Pages/Notifications/notification_page.dart';
import 'package:shimmer/shimmer.dart';
import 'package:player/core/theme/app_colors.dart';
// import '../HomePage/popular_futsal.dart';
// import '../HomePage/nearby_futsal.dart';
import '../HomePage/futsal_detail_screen.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String? selectedFilter;
  String searchQuery = "";
  List<Map<String, dynamic>> futsals = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchFutsals();
  }

  Future<void> fetchFutsals() async {
    try {
      final response =
          await http.get(Uri.parse('${AppConfig.baseUrl}/api/getfutsals'));
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        final List<dynamic> data = decoded['futsals'];
        final List<Map<String, dynamic>> fetched =
            data.cast<Map<String, dynamic>>();
        fetched.sort((a, b) => a['pricePerHour'].compareTo(b['pricePerHour']));
        setState(() {
          futsals = fetched;
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load futsals');
      }
    } catch (e) {
      print('Error fetching futsals: $e');
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> filteredFutsals = futsals.where((futsal) {
      final query = searchQuery.toLowerCase();
      if (selectedFilter == 'name') {
        return futsal['futsalName'].toLowerCase().contains(query);
      } else if (selectedFilter == 'location') {
        return futsal['location'].toLowerCase().contains(query);
      }
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            floating: false,
            pinned: true,
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
                          icon: const Icon(Icons.notifications,
                              color: Colors.white),
                          iconSize: 40.0,
                          onPressed: () {
                            Navigator.push(context, MaterialPageRoute(builder: (context)=>const NotificationPage()));
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 40),
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
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            onChanged: (value) =>
                                setState(() => searchQuery = value),
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: Colors.white,
                              hintText: "Search your futsal!",
                              prefixIcon:
                                  const Icon(Icons.search, color: Colors.grey),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(30),
                                borderSide: BorderSide.none,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Theme(
                          data: Theme.of(context).copyWith(
                            canvasColor: Colors.white, // dropdown background
                            dialogTheme: DialogTheme(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(
                                    30), // rounded border for dropdown
                              ),
                            ),
                          ),
                          child: Container(
                            height: 50,
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(
                                  30), // pill-shaped container
                              border:
                                  Border.all(color: Colors.green, width: 1.5),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: selectedFilter,
                                hint: const Text("Search by"),
                                icon: const Icon(Icons.arrow_drop_down,
                                    color: Colors.green),
                                borderRadius: BorderRadius.circular(
                                    30), // <-- for dropdown popup
                                items: const [
                                  DropdownMenuItem(
                                      value: "name", child: Text("By Name")),
                                  DropdownMenuItem(
                                      value: "location",
                                      child: Text("By Location")),
                                ],
                                onChanged: (value) =>
                                    setState(() => selectedFilter = value),
                              ),
                            ),
                          ),
                        )
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildListDelegate([
              const SizedBox(height: 10),
              if (searchQuery.isNotEmpty && selectedFilter != null)
                _buildFutsalSection(
                    title: "Filtered Results", futsals: filteredFutsals),
              isLoading
                  ? _buildShimmerSection("Popular Futsal")
                  : _buildFutsalSection(
                      title: "Popular Futsal", futsals: futsals),
              const SizedBox(height: 10),
              isLoading
                  ? _buildShimmerSection("Nearby Futsal")
                  : _buildFutsalSection(
                      title: "Nearby Futsal", futsals: futsals),
            ]),
          ),
        ],
      ),
    );
  }

  Widget _buildShimmerSection(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style:
                  const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          SizedBox(
            height: 220,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 3,
              itemBuilder: (context, index) {
                return Container(
                  width: 200,
                  margin: const EdgeInsets.only(right: 10),
                  child: Shimmer.fromColors(
                    baseColor: Colors.grey.shade300,
                    highlightColor: Colors.grey.shade100,
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFutsalSection({
    required String title,
    required List<Map<String, dynamic>> futsals,
  }) {
    if (futsals.isEmpty) return const SizedBox();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style:
                  const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          SizedBox(
            height: 220,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: futsals.length,
              itemBuilder: (context, index) {
                final f = futsals[index];
                return FutsalCard(
                  name: f['futsalName'],
                  location: f['location'],
                  price: f['pricePerHour'],
                  imageUrl: f['images'].isNotEmpty ? f['images'][0] : "",
                  onTap: () => _navigateToDetail(context, f['futsalName']),
                );
              },
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
              child: Image.network(
                imageUrl,
                width: double.infinity,
                height: 120,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) =>
                    const Icon(Icons.broken_image, size: 120),
              ),
            ),
            const SizedBox(height: 8),
            Text(name,
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Text(location,
                style: TextStyle(color: Colors.grey[700], fontSize: 14)),
            const SizedBox(height: 5),
            Text("Price: NPR $price",
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          ],
        ),
      ),
    );
  }
}
