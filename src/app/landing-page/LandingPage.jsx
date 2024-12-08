'use client';

import React from 'react';
import Link from 'next/link';

const ReactLandingPage = () => {
  return (
    <div className="bg-background dark:bg-d_background text-text dark:text-d_text">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to The Ocean 🌊</h1>
        <p className="text-lg mb-6 max-w-2xl">
          Dive into a unified social media experience like no other. <br/> Connect, share, and explore everything in one platform. 🌐
        </p>
        <div className="flex gap-4">
          <Link href="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-500">
              Sign Up
          </Link>
          <Link href="/login" className="bg-gray-800 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-900">
              Log In
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Why The Ocean?</h2>
          <p className="text-lg">
            Born out of the need for a unified platform, **The Ocean** combines the best of social media into one. It’s
            inspired by the vastness of the ocean, where everything finds a place and connects seamlessly.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            <FeatureCard
              title="Droplets"
              description="Create and share content like posts, stories, and reels with ease."
            />
            <FeatureCard
              title="Ripples"
              description="Engage in meaningful conversations and discussions seamlessly."
            />
            <FeatureCard
              title="Stars"
              description="Show appreciation for content you love with a simple star."
            />
            <FeatureCard
              title="Anchors"
              description="Follow people and stay connected with the creators you admire."
            />
            <FeatureCard
              title="Real-time Messaging"
              description="Chat with friends and followers instantly, anytime."
            />
            <FeatureCard
              title="Unified Feed"
              description="Enjoy a streamlined view of content from all your connected accounts."
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-lg">
            The Ocean was crafted with the vision to eliminate the fragmentation of social media. Imagine one place where
            Facebook, Instagram, Twitter, Reddit, and YouTube merge to give you a unified experience. A place where you
            can connect deeply, share effortlessly, and explore freely.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Join The Ocean Today</h2>
        <p className="text-lg mb-6">Start your journey into the most immersive social media experience.</p>
        <Link href="/signup" className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-gray-100">
            Get Started
        </Link>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, description }) => (
  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-700 dark:text-gray-300">{description}</p>
  </div>
);

export default ReactLandingPage;
