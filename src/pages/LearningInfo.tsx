
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const LearningInfo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#fcf9f1]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="flex flex-col items-center">
          {/* House image */}
          <div className="bg-yellow-300 p-4 rounded-lg mb-10">
            <img 
              src="/lovable-uploads/1f332ab3-cee8-4b73-ac79-3e7fbd90796d.png" 
              alt="Spanish House" 
              className="w-40 h-40 object-contain"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            Most of the 225+ hours of Spanish lessons
          </h1>
          
          <p className="text-xl text-center mb-10">
            focus on teaching you how to have real-world conversations, with
            <br />real-world people!
          </p>
          
          <Button
            className="bg-[#FF4500] hover:bg-[#E63946] text-white text-xl px-16 py-6 rounded-full"
            onClick={() => navigate('/')}
          >
            Next
          </Button>
        </div>
      </div>
      
      {/* Login button at top */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          className="bg-white rounded-full px-6 hover:bg-gray-100"
        >
          Log in
        </Button>
      </div>
      
      {/* Progress indicator */}
      <div className="fixed top-0 left-0 right-0">
        <div className="h-1 bg-gray-200">
          <div className="h-1 bg-[#FF4500] w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default LearningInfo;
