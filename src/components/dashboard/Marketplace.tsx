import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, BookOpen, FileText, Download, ShoppingCart, Smartphone, Tv, Lightbulb, GraduationCap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { initializePayment, verifyPayment, checkPurchaseStatus } from "@/services/paystackService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Material = {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: 'ebook' | 'past-question';
  price: number;
  format: string;
  downloads: number;
  status: string;
  created_at: string;
  purchased?: boolean;
};

export default function Marketplace() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('study_materials')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching materials:', error);
          toast('Failed to load study materials');
          return;
        }

        if (!data || !currentUser) {
          setMaterials([]);
          setLoading(false);
          return;
        }

        // Check purchase status for each material
        const materialWithPurchaseStatus = await Promise.all(
          data.map(async (material) => {
            const purchased = await checkPurchaseStatus(currentUser.id, material.id);
            // Ensure the type is either 'ebook' or 'past-question'
            const validType = material.type === 'ebook' || material.type === 'past-question' 
              ? material.type 
              : 'ebook'; // Default to ebook if the type is invalid
            
            return { 
              ...material, 
              purchased,
              type: validType
            } as Material;
          })
        );

        setMaterials(materialWithPurchaseStatus);
      } catch (error) {
        console.error('Error in fetchMaterials:', error);
        toast('An error occurred while loading study materials');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchMaterials();
    }
  }, [currentUser]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMaterials = materials.filter((material) => 
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuyNow = async (material: Material) => {
    if (!currentUser) {
      toast('Please log in to make a purchase');
      navigate('/login');
      return;
    }

    try {
      const response = await initializePayment({
        email: currentUser.email,
        amount: material.price,
        metadata: {
          userId: currentUser.id,
          materialId: material.id,
          service: material.type
        }
      });

      // Fix: Access authorization_url via the data property
      window.location.href = response.data.authorization_url;
    } catch (error) {
      console.error('Error initializing payment:', error);
    }
  };

  const handleDownload = async (material: Material) => {
    toast.success(`Downloading ${material.title}...`);
    // In a real app, this would trigger the actual download
    // For now, we'll just simulate it
    setTimeout(() => {
      toast.success('Download complete!');
    }, 2000);
  };

  const handleUtilityPaymentNavigation = () => {
    // Show a message for now since bill payments functionality would need backend implementation
    toast.info('Bill payment functionality coming soon! Currently focusing on study materials marketplace.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Study Materials Marketplace</h2>
        
        {/* Utility Payments Banner - Fixed with proper contrast and styling */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Smartphone className="h-6 w-6" />
                  Utility Payments & Services 📲
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-3 text-white/90 bg-white/10 rounded-lg p-3">
                    <Smartphone className="h-5 w-5 text-green-300 flex-shrink-0" />
                    <span className="font-medium">Buy Airtime & Data</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90 bg-white/10 rounded-lg p-3">
                    <Lightbulb className="h-5 w-5 text-amber-300 flex-shrink-0" />
                    <span className="font-medium">Pay Electricity Bills</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90 bg-white/10 rounded-lg p-3">
                    <Tv className="h-5 w-5 text-blue-300 flex-shrink-0" />
                    <span className="font-medium">TV Subscriptions</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90 bg-white/10 rounded-lg p-3">
                    <GraduationCap className="h-5 w-5 text-purple-300 flex-shrink-0" />
                    <span className="font-medium">Education Payments</span>
                  </div>
                </div>
                <p className="text-white/80 text-sm mt-3">
                  MTN, Glo, Airtel, 9mobile • PHCN, Eko, Ikeja • DStv, GOtv • WAEC, NECO, JAMB
                </p>
              </div>
              <Button 
                className="w-full lg:w-auto whitespace-nowrap bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3 text-base shadow-lg" 
                size="lg"
                onClick={handleUtilityPaymentNavigation}
              >
                Pay Bills Now
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by subject, title, or keyword..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Materials</TabsTrigger>
          <TabsTrigger value="ebooks">E-Books</TabsTrigger>
          <TabsTrigger value="past-questions">Past Questions</TabsTrigger>
          <TabsTrigger value="purchased">My Purchased Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-9 bg-gray-200 rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))
            ) : filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => (
                <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{material.title}</CardTitle>
                        <CardDescription>{material.subject}</CardDescription>
                      </div>
                      <Badge variant={material.type === 'ebook' ? "default" : "secondary"}>
                        {material.type === 'ebook' ? 'E-Book' : 'Past Question'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {material.description || 'No description available.'}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        {material.type === 'ebook' ? (
                          <BookOpen className="h-4 w-4 text-primary" />
                        ) : (
                          <FileText className="h-4 w-4 text-primary" />
                        )}
                        <span>{material.format}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4 text-primary" />
                        <span>{material.downloads} downloads</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <p className="font-semibold text-lg">₦{material.price.toLocaleString()}</p>
                    {material.purchased ? (
                      <Button variant="outline" onClick={() => handleDownload(material)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    ) : (
                      <Button onClick={() => handleBuyNow(material)} className="bg-primary hover:bg-primary/90">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy Now
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No materials found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm ? 'Try a different search term' : 'No study materials are available right now'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="ebooks">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <Card className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                </CardContent>
              </Card>
            ) : filteredMaterials.filter(m => m.type === 'ebook').length > 0 ? (
              filteredMaterials
                .filter(material => material.type === 'ebook')
                .map((material) => (
                  <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{material.title}</CardTitle>
                          <CardDescription>{material.subject}</CardDescription>
                        </div>
                        <Badge>E-Book</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {material.description || 'No description available.'}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span>{material.format}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4 text-primary" />
                          <span>{material.downloads} downloads</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <p className="font-semibold text-lg">₦{material.price.toLocaleString()}</p>
                      {material.purchased ? (
                        <Button variant="outline" onClick={() => handleDownload(material)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      ) : (
                        <Button onClick={() => handleBuyNow(material)} className="bg-primary hover:bg-primary/90">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Buy Now
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No e-books found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm ? 'Try a different search term' : 'No e-books are available right now'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="past-questions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <Card className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                </CardContent>
              </Card>
            ) : filteredMaterials.filter(m => m.type === 'past-question').length > 0 ? (
              filteredMaterials
                .filter(material => material.type === 'past-question')
                .map((material) => (
                  <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{material.title}</CardTitle>
                          <CardDescription>{material.subject}</CardDescription>
                        </div>
                        <Badge variant="secondary">Past Question</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {material.description || 'No description available.'}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>{material.format}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4 text-primary" />
                          <span>{material.downloads} downloads</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <p className="font-semibold text-lg">₦{material.price.toLocaleString()}</p>
                      {material.purchased ? (
                        <Button variant="outline" onClick={() => handleDownload(material)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      ) : (
                        <Button onClick={() => handleBuyNow(material)} className="bg-primary hover:bg-primary/90">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Buy Now
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No past questions found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm ? 'Try a different search term' : 'No past questions are available right now'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="purchased">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <Card className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                </CardContent>
              </Card>
            ) : filteredMaterials.filter(m => m.purchased).length > 0 ? (
              filteredMaterials
                .filter(material => material.purchased)
                .map((material) => (
                  <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{material.title}</CardTitle>
                          <CardDescription>{material.subject}</CardDescription>
                        </div>
                        <Badge variant={material.type === 'ebook' ? "default" : "secondary"}>
                          {material.type === 'ebook' ? 'E-Book' : 'Past Question'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {material.description || 'No description available.'}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          {material.type === 'ebook' ? (
                            <BookOpen className="h-4 w-4 text-primary" />
                          ) : (
                            <FileText className="h-4 w-4 text-primary" />
                          )}
                          <span>{material.format}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4 text-primary" />
                          <span>{material.downloads} downloads</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <Badge variant="outline" className="text-green-600 bg-green-100">Purchased</Badge>
                      <Button variant="outline" onClick={() => handleDownload(material)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No purchased materials</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  You haven't purchased any study materials yet
                </p>
                <Button variant="outline" className="mt-4" onClick={() => document.querySelector('[data-value="all"]')?.dispatchEvent(new Event('click', { bubbles: true }))}>
                  Explore Marketplace
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
