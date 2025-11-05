import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Link } from "react-router-dom"; 


export function TextPart() {
    return(
        <Card className="text-center flex flex-col bg-transparent border-0 shadow-none">
            <CardHeader>
                <CardTitle className="text-[40px] font-bold text-[#2F3E2F]">Guides written by plant lovers, for plant lovers.</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-[32px] font-medium text-[#2F3E2F]">Step-by-step tips and tutorials to help your plants thrive.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button asChild className="w-[250px] h-[75px] text-[24px] text-[#9FB892] rounded-[30px] bg-[#2F3E2F]"
                >
                    <Link to={"/signup"}>
                        Join Plantetto
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default TextPart