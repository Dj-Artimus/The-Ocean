"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import "../globals.css";
import { DarkMode, LightMode } from "@mui/icons-material";
import { UIStore } from "@/store/UIStore";
import { toggleTheme } from "@/utils/ThemeToggle";
import { UserStore } from "@/store/UserStore";
import { redirect } from "next/navigation";

const ReactLandingPage = () => {
  const { darkModeOn, toggleDarkMode } = UIStore();
  const { GetUser } = UserStore();

  useEffect(() => {
    GetUser().then((userData) => {
      if (userData?.id) return redirect("/");
    });
  }, [GetUser]);

  return (
    <div className="relative bg-background dark:bg-d_background text-text dark:text-d_text customScrollbar">
      <div
        onClick={() => {
          toggleTheme(toggleDarkMode);
        }}
        className="fixed hover:scale-110 active:scale-90 transition-transform duration-300 cursor-pointer w-10 h-10 top-5 right-4"
      >
        {darkModeOn ? (
          <LightMode className="!size-10 absolute text-yellow-500" />
        ) : (
          <DarkMode className="!size-10 absolute text-neutral-600" />
        )}
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to The Ocean 🌊</h1>
        <p className="text-lg mb-6 max-w-2xl">
          Dive into a unified social media experience like no other. <br />{" "}
          Connect, share, and explore everything in one platform. 🌐
        </p>
        <div className="flex gap-4">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-500"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-900"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Why The Ocean?</h2>
          <p className="text-lg">
            Born out of the need for a unified platform,{" "}
            <strong>The Ocean</strong> combines the best of social media into
            one. It&apos;s inspired by the vastness of the ocean, where
            everything finds a place and connects seamlessly.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {/* Droplets Feature Card */}
            <FeatureCard
              title="Droplets"
              description="Create and share content like posts, stories, and reels with ease."
              icon="💧"
            />
            {/* Ripples Feature Card */}
            <FeatureCard
              title="Ripples"
              description="Engage in meaningful conversations and discussions seamlessly."
              icon="🌊"
            />
            {/* Stars Feature Card */}
            <FeatureCard
              title="Stars"
              description="Show appreciation for content you love with a simple star."
              icon="⭐"
            />
            {/* Anchors Feature Card */}
            <FeatureCard
              title="Anchors"
              description="Follow people and stay connected with the creators you admire."
              icon="⚓"
            />
            {/* Real-time Messaging Feature Card */}
            <FeatureCard
              title="Real-time Messaging"
              description="Chat with friends and followers instantly, anytime."
              icon="💬"
            />
            {/* Unified Feed Feature Card */}
            <FeatureCard
              title="Unified Feed"
              description="Enjoy the feel of a streamlined view of content from all your connected accounts."
              icon="📱"
            />
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
          <p className="text-lg mb-6">
            Built with modern web technologies to deliver a seamless experience.
            Here&apos;s the stack that powers <strong>The Ocean:</strong>
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Next.js */}
            <li className="flex flex-col items-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-100 transition ease-in-out duration-300 hover:text-blue-600">
              <span className="text-4xl ">📦</span>
              <p className="text-lg font-medium ">Next.js</p>
              <small className="text-sm text-gray-500">React Framework</small>
            </li>
            {/* Supabase */}
            <li className="flex flex-col items-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-100 transition ease-in-out duration-300 hover:text-green-600">
              <span className="text-4xl ">⚡</span>
              <p className="text-lg font-medium ">Supabase</p>
              <small className="text-sm text-gray-500">Database & Auth</small>
            </li>
            {/* Tailwind CSS */}
            <li className="flex flex-col items-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-100 transition ease-in-out duration-300 hover:text-blue-400">
              <span className="text-4xl ">🎨</span>
              <p className="text-lg font-medium ">Tailwind CSS</p>
              <small className="text-sm text-gray-500">Utility-First CSS</small>
            </li>
            {/* PostgreSQL */}
            <li className="flex flex-col items-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-100 transition ease-in-out duration-300 hover:text-slate-800">
              <span className="text-4xl ">🐘</span>
              <p className="text-lg font-medium">PostgreSQL</p>
              <small className="text-sm text-gray-500">
                Relational Database
              </small>
            </li>
            {/* Zustand */}
            <li className="flex flex-col items-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-100 transition ease-in-out duration-300 hover:text-amber-600">
              <span className="text-4xl ">📚</span>
              <p className="text-lg font-medium ">Zustand</p>
              <small className="text-sm text-gray-500">State Management</small>
            </li>
            {/* Material UI */}
            <li className="flex flex-col items-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-100 transition ease-in-out duration-300 hover:text-indigo-500">
              <span className="text-4xl ">⚙️</span>
              <p className="text-lg font-medium ">Material UI</p>
              <small className="text-sm text-gray-500">UI Components</small>
            </li>
            {/* Framer Motion */}
            <li className="flex flex-col items-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-100 transition ease-in-out duration-300 hover:text-pink-600">
              <span className="text-4xl ">💨</span>
              <p className="text-lg font-medium ">Framer Motion</p>
              <small className="text-sm text-gray-500">Animation Library</small>
            </li>
            {/* React Hot Toast */}
            <li className="flex flex-col items-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-100 transition ease-in-out duration-300 hover:text-orange-500">
              <span className="text-4xl ">🔥</span>
              <p className="text-lg font-medium ">React Hot Toast</p>
              <small className="text-sm text-gray-500">Notifications</small>
            </li>
          </ul>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-16 px-6 bg-blue-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">The Journey</h2>
          <p className="text-lg">
            The Ocean started with a dream to unify all social media platforms
            into one seamless space. Although certain integrations were
            unattainable, the project reflects the ambition to innovate and
            deliver a unique experience. It&apos;s a testament to pushing
            boundaries and learning through challenges.
          </p>
          <p className="text-lg mt-4">
            Some features, like Unified Feed, Stream Connections, Ocean Board,
            Calling, Video Calling, are still aspirational and can be explored
            in a future iteration. These parts are visible through the{" "}
            <span className="font-bold">Ocean Vision Toggle</span>, offering a
            glimpse into what could have been.
          </p>
        </div>
      </section>

      {/* Functional Features Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">What You Can Do</h2>
          <p className="text-lg mb-6">
            Dive into the real, working features of The Ocean today. While the
            vision of a fully unified platform is still in progress, there’s a
            lot you can already enjoy.
          </p>
          <ul className="space-y-8 text-left mx-auto max-w-xl">
            <li className="flex items-center space-x-4 hover:bg-gray-200 dark:hover:bg-gray-700 p-4 rounded-lg transition ease-in-out duration-300 border border-slate-300 dark:border-slate-700 ">
              <span className="">📝</span>
              <p className="text-lg">
                Create and share content as Droplets. You can Explore, Star,
                Ripple them, and many more.
              </p>
            </li>
            <li className="flex items-center space-x-4 hover:bg-gray-200 dark:hover:bg-gray-700 p-4 rounded-lg transition ease-in-out duration-300 border border-slate-300 dark:border-slate-700 ">
              <span className="">⚓</span>
              <p className="text-lg">
                Follow and connect with others using Anchors, stay updated with
                their latest creations.
              </p>
            </li>
            <li className="flex items-center space-x-4 hover:bg-gray-200 dark:hover:bg-gray-700 p-4 rounded-lg transition ease-in-out duration-300 border border-slate-300 dark:border-slate-700 ">
              <span className="">💬</span>
              <p className="text-lg">
                Engage in conversations and spark meaningful discussions through
                Ripples.
              </p>
            </li>
            <li className="flex items-center space-x-4 hover:bg-gray-200 dark:hover:bg-gray-700 p-4 rounded-lg transition ease-in-out duration-300 border border-slate-300 dark:border-slate-700 ">
              <span className="">📱</span>
              <p className="text-lg">
                Enjoy the feel of a unified feed that brings together content
                from your connected accounts.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6 bg-blue-100 dark:bg-gray-900">
        <div className="max-w-4xl text-lg mx-auto">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            🌊 The Ocean Story
          </h2>
          <p className="mb-4">
            The Ocean was crafted with the vision to eliminate the fragmentation
            of social media. 🌐 Imagine one place where Facebook, Instagram,
            Twitter, Reddit, and YouTube merge to give you a unified experience.
            A place where you can connect deeply 🤝, share effortlessly 🖋️, and
            explore freely 🌟.
          </p>
          <h2 className="text-2xl font-bold my-4 flex items-center gap-2">
            💡 The Inspiration Behind The Ocean
          </h2>
          <p className="mb-4">
            Have you ever wondered about the people you follow on social
            media—how their personas shift across platforms? That&apos;s where
            it all started for me. 🤔
          </p>
          <p className="mb-4">
            For example, imagine a creator named DjArtimus. On YouTube 🎥,
            he&apos;s a coder, sharing valuable programming tutorials. But on
            LinkedIn 💼, he&apos;s sharing professional insights on success.
            Then on Twitter 🐦, he&apos;s posting opinions on the latest news,
            and over on Instagram 📸, he&apos;s sharing snapshots of his
            personal life—maybe a vacation 🌴 or a fancy dinner 🍽️.
          </p>
          <p className="italic text-blue-600 dark:text-blue-400 mb-4">
            &quot;What&apos;s he really like across all these platforms?&quot;
          </p>
          <p className="mb-4">
            To get the full picture, I&apos;d need to find him on each platform,
            follow him, switch apps, and piece it all together. That&apos;s when
            the idea struck me: Why can&apos;t all this content exist in one
            place? 🤯
          </p>
          <p className="mb-4">
            What if you could scroll through a unified feed 📜 and see,
            &quot;Oh, he just released a new coding video on YouTube,&quot;
            scroll a bit further and discover, &quot;Wow, he&apos;s sharing
            motivational tips on LinkedIn,&quot; and with another scroll,
            &quot;Oh, he’s tweeting about the latest tech trends.&quot;
          </p>
          <p className="mb-4">
            Wouldn&apos;t that make consuming your favorite creator&apos;s
            content effortless and more enjoyable? 🎉
          </p>
          <p className="mb-4">
            That&apos;s the core idea behind The Ocean: bringing together the
            fragmented experiences of social media into one cohesive platform.
            🤝
          </p>
          <h2 className="text-2xl font-bold my-4 flex items-center gap-2">
            🌟 The Ocean Score: Recognizing True Influence
          </h2>
          <p className="mb-4">
            I also noticed how perception shifts based on followers. Let&apos;s
            stick with DjArtimus. He has 100k subscribers on YouTube, which
            makes him popular and credible in that space. But on LinkedIn, he
            only has 1k followers. For someone discovering him on LinkedIn, they
            might think, &quot;He&apos;s not very influential,&quot; even if his
            content is insightful. 🤷‍♂️
          </p>
          <p className="mb-4">
            That&apos;s the second challenge The Ocean aims to solve. Why should
            someone&apos;s credibility be judged solely by one platform? 🤔 What
            if we could give creators a unified metric—a single number that
            shows their overall influence across all platforms? 💯
          </p>
          <p className="mb-4">
            For DjArtimus, it wouldn&apos;t just be 100k subscribers on YouTube
            or 1k followers on LinkedIn. It would be 101k people across all
            platforms. 🌎
          </p>
          <p className="mb-4">
            This number—what we call the{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              Ocean Score
            </span>
            —levels the playing field. ⚖️ It shows the true scale of
            someone&apos;s influence, helping people appreciate the value they
            bring across all platforms. 🙌
          </p>
          <p className="mb-4">
            These two ideas—unifying social media and recognizing true
            influence—are what led me to create The Ocean. 🌊 It&apos;s a
            journey that&apos;s just beginning, but I believe it&apos;s one
            worth taking. 🚀
          </p>
          <p className="mb-4">
            Although the current version of The Ocean doesn&apos;t yet integrate
            data from all social media platforms due to technical limitations,
            the vision remains intact. What I&apos;ve built is a platform that
            showcases the potential of a unified feed and already supports
            real-time messaging 💬 , meaningful connections 🔗, and intuitive UI
            design 📱 .
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Join The Ocean Today</h2>
        <p className="text-lg mb-6">
          Start your journey into the most immersive social media experience.
        </p>
        <Link
          href="/signup"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-gray-100"
        >
          Get Started
        </Link>
      </section>

      {/* Disclaimer Section */}
      <section className="py-8 px-6 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Disclaimer</h2>
          <p className="text-lg">
            Some features visible in the UI, like Ocean Scores ( available only
            for the oceanites - ocean users ) , Stream Connections, Platform
            Link Board, Calling Features, etc. are conceptual designs intended
            to showcase what could be achieved in future development phases.
          </p>
        </div>
      </section>

      <section className="py-8">
        <Footer />
      </section>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:bg-sky-100 dark:hover:bg-sky-600 transition-all ease-in-out duration-300">
    <div className="text-4xl mb-4 text-indigo-600 dark:text-indigo-300">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 text-center">
      {description}
    </p>
  </div>
);

export default ReactLandingPage;
