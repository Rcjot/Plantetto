interface SmallCard {
  image: string
  name: string
  caption: string 
  price: string
}

export function MarketSmallCard({ image, name, caption, price }: SmallCard) {
  return (
    <div>
      <div className="w-[145px] h-[130px] rounded-[3px] relative overflow-hidden">
      <img 
        className="w-full h-full object-cover rounded-[3px]" 
        src={image} 
        alt={name}
      />

      <div className="absolute bottom-0 left-0 w-full bg-white/80 px-2 py-1 flex items-center justify-between rounded-b-[3px]">
        <div>
          <p className="text-[6px] text-black font-medium">{name}</p>
          <p className="text-[5px] text-black">{caption}</p>
        </div>
        <div>
          <p className="text-[6px] text-black font-semibold">{price}</p>
        </div>
      </div>
    </div>
    </div>
  );
}
