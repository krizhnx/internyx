import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, BarChart3, Tag, Download, Users, Mail, Shield, FileText } from 'lucide-react'

function Homepage({ onGetStarted, onAbout }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Track Applications",
      description: "Keep all your internship applications organized in one place with detailed status tracking."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Visualize Progress",
      description: "See your application progress with beautiful charts and analytics to stay motivated."
    },
    {
      icon: <Tag className="h-8 w-8" />,
      title: "Stay Organized",
      description: "Use tags and filters to categorize and find your applications quickly and efficiently."
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: "Export Data",
      description: "Export your data as CSV, HTML, or print reports to share with mentors and advisors."
    }
  ]

  const testimonials = [
    {
      quote: "Internyx helped me stay organized during my internship search. I applied to 50+ companies and never lost track of any application!",
      author: "Sarah Chen",
      role: "Computer Science Student"
    },
    {
      quote: "The progress tracking and analytics gave me insights into my application strategy. I landed my dream internship at Google!",
      author: "Michael Rodriguez",
      role: "Software Engineering Graduate"
    },
    {
      quote: "Finally, a tool that understands what students need during the internship application process. Highly recommended!",
      author: "Emily Johnson",
      role: "Business Administration Student"
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Internyx
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Track your internship journey with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 group"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to streamline your internship application process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-elevated p-6 text-center hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-primary-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              What students are saying
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of students who have transformed their internship search
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card-elevated p-6 hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">Internyx</h3>
              <p className="text-gray-300 mb-4">
                Empowering students to track and optimize their internship applications with ease.
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li>
                  <button className="text-gray-300 hover:text-white transition-colors">
                    Dashboard
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onAbout}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Privacy Policy</span>
                  </button>
                </li>
                <li>
                  <button className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Terms of Service</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Internyx. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage 