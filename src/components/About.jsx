import { useState, useEffect } from 'react'
import { Mail, Users, Target, Heart, Award, Globe } from 'lucide-react'

function About({ onBack }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const team = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      bio: "Former software engineer who experienced the chaos of tracking 100+ internship applications. Built Internyx to solve this problem for students everywhere.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Sarah Kim",
      role: "Head of Product",
      bio: "Product manager with a passion for user experience. Believes that great tools should be both powerful and delightful to use.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "David Rodriguez",
      role: "Lead Developer",
      bio: "Full-stack developer who loves building tools that make people's lives easier. Focused on creating robust, scalable solutions.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ]

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Student-First",
      description: "Everything we build is designed with students' needs in mind."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Empowering",
      description: "We believe every student deserves the tools to succeed in their career journey."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality",
      description: "We're committed to building reliable, intuitive tools that students can depend on."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Accessible",
      description: "Making career tools available to students from all backgrounds and circumstances."
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={onBack}
          className="text-gray-300 hover:text-white transition-colors mb-8 flex items-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Home</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About Internyx
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
              Our mission is to empower students and job seekers to track and optimize their internship applications.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Internyx was created
              </h2>
              <div className="space-y-4 text-gray-300 text-lg">
                <p>
                  During my senior year of college, I applied to over 100 internship positions. 
                  What started as an exciting journey quickly became a nightmare of spreadsheets, 
                  sticky notes, and forgotten follow-ups.
                </p>
                <p>
                  I found myself losing track of which companies I had applied to, when I had 
                  applied, and what the next steps were. The stress of managing multiple 
                  applications was taking away from my ability to prepare for interviews and 
                  focus on my studies.
                </p>
                <p>
                  That's when I realized there had to be a better way. I built Internyx to 
                  solve this exact problem - to help students stay organized, track their 
                  progress, and ultimately land their dream internships.
                </p>
              </div>
            </div>
            <div className="card-elevated p-8">
              <div className="text-center">
                <Users className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Join thousands of students
                </h3>
                <p className="text-gray-300">
                  Students from over 500 universities worldwide trust Internyx to manage their 
                  internship applications and advance their careers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-300">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="card-elevated p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="text-primary-500 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300">
              The passionate people behind Internyx
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="card-elevated p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-500 mb-3">
                  {member.role}
                </p>
                <p className="text-gray-300 text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-elevated p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Have questions, feedback, or just want to say hello? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@internyx.com"
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2"
              >
                <Mail className="h-5 w-5" />
                <span>hello@internyx.com</span>
              </a>
              <button className="btn-secondary text-lg px-8 py-4">
                Join Our Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Internyx. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default About 