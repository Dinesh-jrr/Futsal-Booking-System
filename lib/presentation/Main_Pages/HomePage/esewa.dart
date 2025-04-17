// ignore_for_file: use_build_context_synchronously

import 'dart:convert';
import 'package:esewa_flutter_sdk/esewa_flutter_sdk.dart';
import 'package:esewa_flutter_sdk/esewa_config.dart';
import 'package:esewa_flutter_sdk/esewa_payment.dart';
import 'package:esewa_flutter_sdk/esewa_payment_success_result.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:player/common/esewa.dart';
import 'package:player/core/config/constants.dart';
import 'package:player/presentation/Main_Pages/HomePage/booking_success.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Esewa {
  final String futsalName;
  final DateTime selectedDay;
  final String? selectedTimeSlot;
  final double advancePayment;
  late String bookingId; // late so we can set after booking creation
  final double totalCost;
  final String userId;

  Esewa({
    required this.futsalName,
    required this.selectedDay,
    required this.selectedTimeSlot,
    required this.advancePayment,
    required this.bookingId,
    required this.totalCost,
    required this.userId,
  });

  void pay(BuildContext context) {
    try {
      EsewaFlutterSdk.initPayment(
        esewaConfig: EsewaConfig(
          environment: Environment.test,
          clientId: kEsewaClientId,
          secretId: kEsewaSecretKey,
        ),
        esewaPayment: EsewaPayment(
          productId: "futsal-${DateTime.now().millisecondsSinceEpoch}",
          productName: futsalName,
          productPrice: advancePayment.toStringAsFixed(2),
          callbackUrl: '',
        ),
        onPaymentSuccess: (EsewaPaymentSuccessResult result) async {
          debugPrint('✅ Payment Success, Ref ID: ${result.refId}');
          await verifyTransaction(context, result);
          Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => BookingSuccessScreen(
        futsalName: futsalName,
        timeSlot: selectedTimeSlot ?? '',
        day: selectedDay,
        amount: advancePayment,
        transactionId: result.refId,
      ),
    ),
  );
        },
        onPaymentFailure: () {
          debugPrint('❌ Payment Failure');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Payment failed. Please try again.")),
          );
        },
        onPaymentCancellation: () {
          debugPrint('⚠️ Payment Cancelled');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Payment cancelled by user.")),
          );
        },
      );
    } catch (e) {
      debugPrint('⚠️ Exception during payment: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("An error occurred. Please try again.")),
      );
    }
  }

  Future<void> verifyTransaction(BuildContext context, EsewaPaymentSuccessResult result) async {
    final url = Uri.parse("https://rc.esewa.com.np/mobile/transaction?txnRefId=${result.refId}");

    try {
      final response = await http.get(
        url,
        headers: {
          "merchantId": kEsewaClientId,
          "merchantSecret": kEsewaSecretKey,
          "Content-Type": "application/json",
        },
      );

      if (response.statusCode == 200) {
        debugPrint("🔍 Verification response: ${response.body}");
        final data = jsonDecode(response.body);

        if (data is List && data.isNotEmpty) {
          final transactionDetails = data[0]["transactionDetails"];
          if (transactionDetails is Map<String, dynamic> && transactionDetails["status"] == "COMPLETE") {
            debugPrint("✅ Transaction status: COMPLETE");

            await createBookings(context);
            await savePaymentHistory(context, result);
          } else {
            debugPrint("❌ Payment not complete or format invalid");
          }
        } else {
          debugPrint("❌ Invalid verification response.");
        }
      } else {
        debugPrint("❌ Error verifying transaction: ${response.statusCode}");
      }
    } catch (e) {
      debugPrint("⚠️ Exception verifying transaction: $e");
    }
  }

  Future<void> createBookings(BuildContext context) async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('auth_token');

      final userResponse = await http.get(
        Uri.parse('${AppConfig.baseUrl}/api/users/me'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${token ?? ''}',
        },
      );

      final userData = json.decode(userResponse.body);
      final userId = userData['_id'];

      final bookingResponse = await http.post(
        Uri.parse("${AppConfig.baseUrl}/api/bookings"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "futsalName": futsalName,
          "selectedDay": selectedDay.toIso8601String(),
          "selectedTimeSlot": selectedTimeSlot,
          "status": "partiallyPaid",
          "totalCost": totalCost,
          "advancePayment": advancePayment,
          "userId": userId,
        }),
      );

      if (bookingResponse.statusCode == 201) {
        final bookingData = json.decode(bookingResponse.body);
        if (bookingData.containsKey('booking')) {
          bookingId = bookingData['booking']['_id'];
          debugPrint("✅ Booking created: $bookingId");
        } else {
          debugPrint("❌ 'booking' key missing in response: ${bookingResponse.body}");
        }
      } else {
        debugPrint("❌ Booking creation failed: ${bookingResponse.statusCode}");
        debugPrint("Response: ${bookingResponse.body}");
      }
    } catch (e) {
      debugPrint("⚠️ Exception creating booking: $e");
    }
  }

  Future<void> savePaymentHistory(BuildContext context, EsewaPaymentSuccessResult result) async {
    try {
      if (bookingId.isEmpty) {
        debugPrint("❌ Booking ID is missing. Cannot save payment.");
        return;
      }

      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('auth_token');

      final userResponse = await http.get(
        Uri.parse('${AppConfig.baseUrl}/api/users/me'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${token ?? ''}',
        },
      );

      final userBody = json.decode(userResponse.body);
      final userId = userBody['_id'];

      final paymentResponse = await http.post(
        Uri.parse("${AppConfig.baseUrl}/api/payment/create"),
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonEncode({
          "user": userId,
          "booking": bookingId,
          "transactionUuid": result.refId,
          "amount": advancePayment,
          "status": "Pending",
          "paymentGateway": "eSewa",
        }),
      );

      if (paymentResponse.statusCode == 200 || paymentResponse.statusCode == 201) {
        debugPrint("✅ Payment history saved successfully.");
         // ➕ Show success screen
  
      } else {
        debugPrint("❌ Failed to save payment. Code: ${paymentResponse.statusCode}");
        debugPrint("Response body: ${paymentResponse.body}");
      }
    } catch (e) {
      debugPrint("⚠️ Exception while saving payment history: $e");
    }
  }
}
