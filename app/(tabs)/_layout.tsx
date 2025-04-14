import { Link, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import GradientButton from "../../components/Button";


export default function TabsLayout(){
    const signupButton = (
        <Link href="/signup" asChild>
          <GradientButton title="Signup" onPress={() => {}} />
        </Link>
      );
    return(
        <Tabs
        screenOptions={{
            headerStyle:{
                backgroundColor: "#ffffff",
            },
        tabBarActiveTintColor: "#8855dd",
        headerShadowVisible:false,
        headerRight:()=>signupButton
        }}
        >
            <Tabs.Screen name="index"
            options={{headerTitle:"Home",
                tabBarIcon:({focused,color})=>
                <Ionicons name={focused? "home-sharp": "home-outline"}
                size={30} />
            }}/>
            <Tabs.Screen name="about"
            options={{headerTitle:"About us",
                tabBarIcon:({focused, color})=>
                    <Ionicons name={focused? "information-circle-sharp": "information-circle-outline"} size={30}/>
            }}
            />
        </Tabs>
    );
}