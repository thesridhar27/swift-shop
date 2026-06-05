const products = [
  // Electronics
  { name: 'Airpods Wireless Headphones', image: '/images/airpods.jpg', description: 'Bluetooth technology with high-quality sound.', brand: 'Apple', category: 'Electronics', price: 12900, countInStock: 10, rating: 4.5, numReviews: 12 },
  { name: 'iPhone 13 Pro 256GB', image: '/images/phone.jpg', description: 'A total leap forward in battery life.', brand: 'Apple', category: 'Electronics', price: 119900, countInStock: 7, rating: 4.0, numReviews: 8 },
  { name: 'Cannon EOS 80D DSLR', image: '/images/camera.jpg', description: 'Versatile imaging specs for pros.', brand: 'Cannon', category: 'Electronics', price: 82000, countInStock: 5, rating: 3, numReviews: 12 },
  { name: 'Sony Playstation 5', image: '/images/playstation.jpg', description: 'The ultimate home entertainment center.', brand: 'Sony', category: 'Electronics', price: 54990, countInStock: 11, rating: 5, numReviews: 12 },
  { name: 'Logitech Wireless Mouse', image: '/images/mouse.jpg', description: 'High precision gaming mouse.', brand: 'Logitech', category: 'Electronics', price: 2500, countInStock: 7, rating: 3.5, numReviews: 10 },
  { name: 'Amazon Echo Dot (3rd Gen)', image: '/images/alexa.jpg', description: 'Voice-controlled smart speaker.', brand: 'Amazon', category: 'Electronics', price: 3499, countInStock: 0, rating: 4, numReviews: 12 },
  
  // Laptops & Computing
  { name: 'MacBook Air M2', image: '/images/macbook.jpg', description: 'Thinner, lighter, and faster with M2 chip.', brand: 'Apple', category: 'Computing', price: 104900, countInStock: 5, rating: 4.8, numReviews: 15 },
  { name: 'Dell XPS 13', image: '/images/dell.jpg', description: 'The best Windows laptop for professionals.', brand: 'Dell', category: 'Computing', price: 95000, countInStock: 4, rating: 4.2, numReviews: 9 },
  { name: 'HP Pavilion Gaming', image: '/images/hp.jpg', description: 'Powerful gaming performance on a budget.', brand: 'HP', category: 'Computing', price: 65000, countInStock: 3, rating: 4.0, numReviews: 20 },
  { name: 'Samsung 27" Curved Monitor', image: '/images/monitor.jpg', description: 'Immersive viewing experience.', brand: 'Samsung', category: 'Computing', price: 18500, countInStock: 8, rating: 4.5, numReviews: 14 },
  
  // Audio & Wearables
  { name: 'Boat Rockerz 450', image: '/images/boat.jpg', description: 'Heavy bass wireless headphones.', brand: 'Boat', category: 'Audio', price: 1499, countInStock: 25, rating: 4.1, numReviews: 50 },
  { name: 'JBL Flip 6 Speaker', image: '/images/jbl.jpg', description: 'Portable waterproof Bluetooth speaker.', brand: 'JBL', category: 'Audio', price: 9999, countInStock: 12, rating: 4.7, numReviews: 30 },
  { name: 'Noise ColorFit Smartwatch', image: '/images/noise.jpg', description: 'Health tracking and notifications.', brand: 'Noise', category: 'Wearables', price: 2999, countInStock: 15, rating: 4.0, numReviews: 45 },
  { name: 'Sony WH-1000XM4', image: '/images/sony-headphones.jpg', description: 'Industry leading noise cancellation.', brand: 'Sony', category: 'Audio', price: 22990, countInStock: 6, rating: 4.9, numReviews: 100 },
  
  // Lifestyle & Others
  { name: 'Kindle Paperwhite', image: '/images/kindle.jpg', description: 'Read anywhere with adjustable warm light.', brand: 'Amazon', category: 'Electronics', price: 13999, countInStock: 10, rating: 4.6, numReviews: 22 },
  { name: 'Seagate 2TB External HDD', image: '/images/hdd.jpg', description: 'Store all your files safely.', brand: 'Seagate', category: 'Computing', price: 5500, countInStock: 20, rating: 4.3, numReviews: 18 },
  { name: 'TP-Link WiFi Router', image: '/images/router.jpg', description: 'High-speed dual-band internet.', brand: 'TP-Link', category: 'Electronics', price: 2200, countInStock: 30, rating: 4.0, numReviews: 11 },
  { name: 'Apple Watch Series 8', image: '/images/apple-watch.jpg', description: 'The ultimate device for a healthy life.', brand: 'Apple', category: 'Wearables', price: 45900, countInStock: 4, rating: 4.8, numReviews: 25 },
  { name: 'Samsung Galaxy Tab S8', image: '/images/tablet.jpg', description: 'Powerful Android tablet with S-Pen.', brand: 'Samsung', category: 'Electronics', price: 51000, countInStock: 5, rating: 4.4, numReviews: 19 },
  { name: 'GoPro HERO11 Black', image: '/images/gopro.jpg', description: 'Action camera with extreme stability.', brand: 'GoPro', category: 'Electronics', price: 39000, countInStock: 8, rating: 4.7, numReviews: 33 }
];

export default products;