# commented line previously existed.
# from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import FAQ
from .serializers import FAQSerializer

# Create your views here.


class ChatAPIView(APIView):
    """
    API view to handle chat messages.
    """
    def post(self, request, *args, **kwargs):
        # Get the user's message from the incoming request
        user_message = request.data.get('message', '').lower()

        if not user_message:
            return Response({"error": "No message provided"}, status=400)

        # Simple Keyword Matching Logic
        # ---------------------------
        best_match = None
        # Split the user's message into individual words
        user_words = set(user_message.split())

        # Loop through all FAQs in the database
        for faq in FAQ.objects.all():
            # Split the FAQ's keywords into a set for efficient checking
            faq_keywords = set(faq.keywords.lower().split(','))

            # Find common words between the user's message and the FAQ's keywords
            common_keywords = user_words.intersection(faq_keywords)

            if common_keywords:
                best_match = faq
                break # Stop at the first match for simplicity

        # ---------------------------

        if best_match:
            # If we found a match, prepare the response
            response_data = {
                'answer': best_match.answer
            }
            return Response(response_data)
        else:
            # If no match is found, send a default response
            # In Phase 3, we will upgrade this to create a support ticket
            return Response({
                'answer': "I'm sorry, I don't have an answer for that. Could you please rephrase your question?"
            })