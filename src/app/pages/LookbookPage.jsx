export function LookbookPage() {
  const lookbooks = [
    {
      id: 1,
      title: "Street Style 2026",
      description: "Phong cách đường phố năng động và cá tính",
      image: "https://images.unsplash.com/photo-1590884226650-3611f205c13e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbG9va2Jvb2slMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzcyODcyNTY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Street"
    },
    {
      id: 2,
      title: "Elegant Evening",
      description: "Sang trọng và thanh lịch cho buổi tối",
      image: "https://images.unsplash.com/photo-1747707500073-65dd5c1407b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBmZW1hbGUlMjBkcmVzc3xlbnwxfHx8fDE3NzI4NzI1NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Elegant"
    },
    {
      id: 3,
      title: "Office Chic",
      description: "Phong cách công sở hiện đại",
      image: "https://images.unsplash.com/photo-1618008797651-3eb256213400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBtYWxlJTIwc2hpcnR8ZW58MXx8fHwxNzcyODcyNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Office"
    },
    {
      id: 4,
      title: "Summer Vibes",
      description: "Tươi mát và năng động cho mùa hè",
      image: "https://images.unsplash.com/photo-1759572095329-1dcf9522762b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3VtbWVyJTIwdHNoaXJ0fGVufDF8fHx8MTc3Mjg3MjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Summer"
    },
    {
      id: 5,
      title: "Winter Warmth",
      description: "Ấm áp và phong cách cho mùa đông",
      image: "https://images.unsplash.com/photo-1768134152610-27355e256513?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwd2ludGVyJTIwY29hdHxlbnwxfHx8fDE3NzI4NzI1NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Winter"
    },
    {
      id: 6,
      title: "Casual Comfort",
      description: "Thoải mái và dễ phối đồ hàng ngày",
      image: "https://images.unsplash.com/photo-1612357917631-d8697c2af152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBmZW1hbGUlMjBibG91c2V8ZW58MXx8fHwxNzcyODcyNTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Casual"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Lookbook Thời Trang</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Khám phá xu hướng thời trang mới nhất và cảm hứng phối đồ cho mọi phong cách
        </p>
      </div>

      {/* Lookbook Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lookbooks.map((lookbook, index) => (
          <div
            key={lookbook.id}
            className={`group relative rounded-lg overflow-hidden ${
              index === 0 ? "md:col-span-2 md:row-span-2" : ""
            }`}
          >
            <div className={`relative ${index === 0 ? "aspect-[16/10]" : "aspect-[3/4]"} bg-gray-100`}>
              <img
                src={lookbook.image}
                alt={lookbook.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm mb-3">
                    {lookbook.category}
                  </span>
                  <h3 className={`font-bold mb-2 ${index === 0 ? "text-3xl" : "text-xl"}`}>
                    {lookbook.title}
                  </h3>
                  <p className="text-sm opacity-90 mb-4">{lookbook.description}</p>
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors">
                    Khám phá
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Tạo phong cách riêng của bạn</h2>
        <p className="text-lg mb-8 opacity-90">
          Khám phá bộ sưu tập thời trang đa dạng và tìm kiếm outfit hoàn hảo cho bạn
        </p>
        <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          Mua sắm ngay
        </button>
      </div>
    </div>
  );
}
