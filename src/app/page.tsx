"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import {
  ShoppingCart,
  Star,
  Shield,
  Clock,
  Leaf,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  TrendingUp,
} from "lucide-react"


// Mock data for demonstration - replace with your actual API calls
const mockFeaturedProducts = [
  {
    _id: "1",
    name: "Ashwagandha Premium",
    description: "Pure Ashwagandha extract for stress relief and vitality boost",
    sellingPrice: 899,
    mrp: 1299,
    gstPercentage: 12,
    image: "/prod.png",
    inStock: true,
    category: "Wellness",
    rating: 4.8,
    reviews: 234,
  },
  {
    _id: "2",
    name: "Turmeric Gold",
    description: "Organic turmeric with curcumin for anti-inflammatory benefits",
    sellingPrice: 649,
    mrp: 899,
    gstPercentage: 12,
    image: "/prod.png",
    inStock: true,
    category: "Immunity",
    rating: 4.9,
    reviews: 189,
  },
  {
    _id: "3",
    name: "Brahmi Boost",
    description: "Memory enhancer and cognitive support supplement",
    sellingPrice: 749,
    mrp: 999,
    gstPercentage: 12,
    image: "/prod.png",
    inStock: true,
    category: "Brain Health",
    rating: 4.7,
    reviews: 156,
  },
  {
    _id: "4",
    name: "Triphala Detox",
    description: "Natural detox and digestive health formula",
    sellingPrice: 549,
    mrp: 799,
    gstPercentage: 12,
    image: "/prod.png",
    inStock: false,
    category: "Digestive",
    rating: 4.6,
    reviews: 203,
  },
]

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  const slides = [
    {
      title: "Ancient Wisdom, Modern Wellness",
      subtitle: "Discover the Power of Ayurveda",
      description: "Transform your health with 5000-year-old healing traditions",
      image: "/prod.png",
      cta: "Explore Products",
    },
    {
      title: "Pure, Natural, Effective",
      subtitle: "Premium Ayurvedic Supplements",
      description: "Handcrafted with the finest herbs and traditional methods",
      image: "/prod.png",
      cta: "Shop Now",
    },
    {
      title: "Holistic Health Solutions",
      subtitle: "Mind, Body & Spirit",
      description: "Complete wellness approach for modern lifestyle challenges",
      image: "/prod.png",
      cta: "Learn More",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative h-[100vh] overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">

      {/* <Navbar/> */}

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-300/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div style={{ y }} className="relative h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-6"
                  >
                    <span className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 px-4 py-2 rounded-full text-sm font-medium border border-emerald-400/30">
                      <Leaf className="w-4 h-4" />
                      100% Natural & Organic
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                  >
                    {slides[currentSlide].title}
                  </motion.h1>

                  <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-2xl md:text-3xl text-emerald-200 mb-6 font-light"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-xl text-white/80 mb-8 max-w-2xl"
                  >
                    {slides[currentSlide].description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                    >
                      {slides[currentSlide].cta}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold backdrop-blur-sm"
                    >
                      Watch Story
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-12 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-emerald-400" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Stats Overlay */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-20 right-8 hidden lg:block"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { number: "50K+", label: "Happy Customers", icon: Users },
                { number: "98%", label: "Satisfaction Rate", icon: Award },
                { number: "5000+", label: "Years of Tradition", icon: TrendingUp },
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="space-y-2">
                    <Icon className="w-6 h-6 text-emerald-300 mx-auto" />
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

const ProductCard = ({ product, index }: { product: any; index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Discount Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)}% OFF
            </span>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" variant="secondary" className="rounded-full p-2">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-emerald-600 font-medium">{product.category}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-gray-500">({product.reviews})</span>
            </div>
          </div>
          <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">{product.name}</CardTitle>
        </CardHeader>

        <CardContent className="flex-grow">
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">₹{product.sellingPrice}</span>
                <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
              </div>
              <p className="text-xs text-gray-500">GST: {product.gstPercentage}%</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full group"
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

const BenefitCard = ({ benefit, index }: { benefit: any; index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
      className="group"
    >
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-100 h-full">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow"
        >
          <benefit.icon className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-emerald-600 transition-colors">
          {benefit.title}
        </h3>

        <p className="text-gray-600 leading-relaxed">{benefit.description}</p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
          className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mt-6 origin-left"
        />
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState(mockFeaturedProducts)
  const [loading, setLoading] = useState(false)

  const benefits = [
    {
      icon: Shield,
      title: "Natural Healing",
      description:
        "Harness the power of nature with our carefully selected herbs and plants, free from synthetic additives and harmful chemicals.",
    },
    {
      icon: Heart,
      title: "Balanced Wellness",
      description:
        "Achieve harmony between mind, body, and spirit through our holistic approach to health and wellness.",
    },
    {
      icon: Clock,
      title: "Time-Tested Wisdom",
      description:
        "Built on 5,000 years of Ayurvedic tradition, our formulations have been proven effective across generations.",
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <HeroSlider />

      {/* Featured Products Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #14b8a6 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Featured Products
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Premium Ayurvedic
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {" "}
                Collection
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our handpicked selection of premium Ayurvedic supplements, crafted with the finest herbs and
              traditional wisdom.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white px-8 py-4 rounded-full text-lg font-semibold group transition-all duration-300"
              >
                Explore All Products
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-300/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-emerald-400/30">
              <Leaf className="w-4 h-4" />
              Why Choose Ayurveda
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The Power of Ancient Wisdom</h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Experience the transformative benefits of Ayurveda, backed by thousands of years of proven results and
              modern scientific validation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} benefit={benefit} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Health?</h2>
            <p className="text-xl text-emerald-100 mb-10 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have discovered the power of authentic Ayurvedic wellness. Start
              your journey to better health today.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  >
                    Shop Now
                    <ShoppingCart className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                  >
                    Get Consultation
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center items-center gap-8 text-emerald-100"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>100% Natural</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Lab Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>30-Day Return</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
