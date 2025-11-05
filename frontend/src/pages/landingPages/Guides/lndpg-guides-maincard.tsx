import { Card } from "@/components/ui/card"
import { Heart, Bookmark} from 'lucide-react';

export function GuideMainCard() {
return (
  
    <div className="ml-[150px] mt-[60px]">

      <Card className="w-[493px] h-[213px] bg-[#F6C667] flex flex-col rounded-[19px] border-none outline-none shadow-none">
        <div className="ml-[100px] mb-[-10px]">
          <h1 className="text-[23px] font-bold">
            How to Care for Clivia
          </h1>

          <p className="text-[14px]">
            Clivia requires lighting that mimics its conditions in the wild: deep or partial shade. 
            In the home, this means bright diffused light, such as through a north window or an east or west window shaded from sunlight. 
            Outdoors, this means shade. (Too bright or direct sun can bur...
          </p>
        </div>
        
        <div className="flex flex-row ml-[25px] mb-[-20px]">
          <div className="flex flex-row">
            <Heart />
            <p className="ml-[3px]">2.3k</p>
          </div>
          <div className="ml-[20px]">
            <Bookmark/>
          </div>
        </div>
 
    </Card>
    </div>
  );
}
export default GuideMainCard