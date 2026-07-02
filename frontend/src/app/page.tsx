'use client';

import { LandingNav } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { ProblemSection } from '@/components/landing/problem-section';
import { WhyFarmingFailsSection } from '@/components/landing/why-farming-fails-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { SchemesSection } from '@/components/landing/schemes-section';
import { PlatformPreviewSection } from '@/components/landing/platform-preview-section';
import { ImpactSection } from '@/components/landing/impact-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { FAQSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      {/* 01. Navigation Header */}
      <LandingNav />
      
      <main className="flex-1">
        {/* 02. Hero Section */}
        <HeroSection />

        {/* Divider */}
        <div className="section-divider" />
        
        {/* 03. Problem Section */}
        <ProblemSection />

        {/* Divider */}
        <div className="section-divider" />
        
        {/* 04. Why Farming Fails */}
        <WhyFarmingFailsSection />

        {/* Divider */}
        <div className="section-divider" />
        
        {/* 05. How it Works */}
        <HowItWorksSection />

        {/* Divider */}
        <div className="section-divider" />
        
        {/* 06. Features Matrix */}
        <FeaturesSection />

        {/* Divider */}
        <div className="section-divider" />
        
        {/* 07. Government Schemes */}
        <SchemesSection />

        {/* Divider */}
        <div className="section-divider" />
        
        {/* 12. Platform Preview */}
        <PlatformPreviewSection />

        {/* Divider */}
        <div className="section-divider" />
        
        {/* 13. Impact Metrics */}
        <ImpactSection />

        {/* Divider */}
        <div className="section-divider" />
        
        {/* 14. Customer Testimonials */}
        <TestimonialsSection />

        {/* Divider */}
        <div className="section-divider" />
        
        {/* 15. FAQ Section */}
        <FAQSection />

        {/* Divider */}
        <div className="section-divider" />
        
        {/* 16. Call to Action */}
        <CTASection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
