import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";


export function MarketTextPart() {
    return(
        <Card className="text-center flex flex-col bg-transparent border-0 shadow-none">
            <CardHeader>
                <CardTitle className="text-[40px] font-bold text-[#4B2E22]">Buy, sell, and trade plants with the community.</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-[32px] font-medium text-[#4B2E22]">Find seeds, tools, and rare plants — all in one place</p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button asChild className="w-[250px] h-[75px] text-[24px] text-[#C96E48] rounded-[30px] bg-[#4B2E22]"
                >
                    <Link to={"/signup"}
                        >
                            Join Plantetto
                        </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}