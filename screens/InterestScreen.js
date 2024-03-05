import { StyleSheet, Text, View,ScrollView,TouchableOpacity,Button } from 'react-native'
import React,{useState,useEffect} from 'react'

import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import{Cricket,
  Basketball,
  Football,
  BaseBall,
  Tennis,
  VollyBall,
  IceHockey,
  Handball,
  Rugby
} from '../assets/icons'

export default function InterestScreen(props) {
  const [selectedGame, setSelectedGame] = useState();
  const [Game, setGame] = useState({
    Cricket:false,
    Basketball:false,
    Football:false,
    BaseBall:false,
    Tennis:false,
    VollyBall:false,
    IceHockey:false,
    Handball:false,
    Rugby:false,
  });
  
  useEffect(() => {

  }, [Game,selectedGame]);
  
function updateInterest (){
  // console.log("updateInterest"+auth().currentUser.uid)
      firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .update({
        interest: Game,
      })
      .then(() => {
        console.log('User updated!');
      });
  props.navigation.navigate("MainHome");
}

  return (
    <ScrollView style={styles.MainBody}>
      <View style={styles.Container}>
        <Text style={styles.Heading}>What sport do you interest?</Text>
        <Text style={styles.SubHeading}>You can choose more than one</Text>
        <View style={{marginTop:59}}>
          <View style={{flexDirection: 'row',justifyContent:'space-between'}}>
              <View>
                <TouchableOpacity style={styles.RoundButton} onPress={()=>{setGame({...Game,Cricket:!Game.Cricket})}}>
                  {Game.Cricket == true
                  ?<LinearGradient style={styles.RoundButton} colors={['#F4A58A', '#ED6B4E']} start={{x: 0.35, y: 0.35}} end={{x: 0.8, y: 1.0}}>
                      <Cricket/>
                    </LinearGradient>
                  : <Cricket/>
                  }
                  
                </TouchableOpacity>
                <Text style={styles.GameName}>Cricket</Text>
              </View>
              <View>
                  <TouchableOpacity style={styles.RoundButton} onPress={()=>{setGame({...Game,Basketball:!Game.Basketball})}}>
                    {Game.Basketball== true
                      ?<LinearGradient style={styles.RoundButton} colors={['#F4A58A', '#ED6B4E']} start={{x: 0.35, y: 0.35}} end={{x: 0.8, y: 1.0}}>
                          <Basketball/>
                      </LinearGradient>
                      :<Basketball/>
                    }
                  </TouchableOpacity>
                  <Text style={styles.GameName}>Basketball</Text>
              </View>
              <View>
                  <TouchableOpacity style={styles.RoundButton} onPress={()=>{setGame({...Game,Football:!Game.Football})}}>
                    {Game.Football==true
                        ?<LinearGradient style={styles.RoundButton} colors={['#F4A58A', '#ED6B4E']} start={{x: 0.35, y: 0.35}} end={{x: 0.8, y: 1.0}}>
                          <Football/>
                        </LinearGradient>
                        :<Football/>
                    }
                  </TouchableOpacity>
                  <Text style={styles.GameName}>Football</Text>
              </View>
          </View>
          <View style={{flexDirection: 'row',justifyContent:'space-between',marginTop:37}}>
              <View>
                  <TouchableOpacity style={styles.RoundButton} onPress={()=>{setGame({...Game,BaseBall:!Game.BaseBall})}}>
                    {Game.BaseBall==true
                        ?<LinearGradient style={styles.RoundButton} colors={['#F4A58A', '#ED6B4E']} start={{x: 0.35, y: 0.35}} end={{x: 0.8, y: 1.0}}>
                          <BaseBall/>
                        </LinearGradient>
                        :<BaseBall/>
                    }
                  </TouchableOpacity>
                  <Text style={styles.GameName}>Baseball</Text>
              </View>
              <View>
                  <TouchableOpacity style={styles.RoundButton} onPress={()=>{setGame({...Game,Tennis:!Game.Tennis})}}>
                    {Game.Tennis==true
                        ?<LinearGradient style={styles.RoundButton} colors={['#F4A58A', '#ED6B4E']} start={{x: 0.35, y: 0.35}} end={{x: 0.8, y: 1.0}}>
                          <Tennis/>
                        </LinearGradient>
                        :<Tennis/>
                    }
                  </TouchableOpacity>
                  <Text style={styles.GameName}>Tennis</Text>
              </View>
              <View>    
                  <TouchableOpacity style={styles.RoundButton} onPress={()=>{setGame({...Game,VollyBall:!Game.VollyBall})}}>
                    {Game.VollyBall==true
                        ?<LinearGradient style={styles.RoundButton} colors={['#F4A58A', '#ED6B4E']} start={{x: 0.35, y: 0.35}} end={{x: 0.8, y: 1.0}}>
                          <VollyBall/>
                        </LinearGradient>
                        :<VollyBall/>
                    }
                  </TouchableOpacity>
                  <Text style={styles.GameName}>Volleyball</Text>
              </View>
          </View>
          <View style={{flexDirection: 'row',justifyContent:'space-between',marginTop:37}}>
              <View>
                  <TouchableOpacity style={styles.RoundButton} onPress={()=>{setGame({...Game,IceHockey:!Game.IceHockey})}}>
                    {Game.IceHockey==true
                        ?<LinearGradient style={styles.RoundButton} colors={['#F4A58A', '#ED6B4E']} start={{x: 0.35, y: 0.35}} end={{x: 0.8, y: 1.0}}>
                          <IceHockey/>
                        </LinearGradient>
                        :<IceHockey/>
                    }
                  </TouchableOpacity>
                  <Text style={styles.GameName}>IceHockey</Text>
              </View>
              <View>
                  <TouchableOpacity style={styles.RoundButton} onPress={()=>{setGame({...Game,Handball:!Game.Handball})}}>
                    {Game.Handball==true
                        ?<LinearGradient style={styles.RoundButton} colors={['#F4A58A', '#ED6B4E']} start={{x: 0.35, y: 0.35}} end={{x: 0.8, y: 1.0}}>
                          <Handball/>
                        </LinearGradient>
                        :<Handball/>
                    }
                  </TouchableOpacity>
                  <Text style={styles.GameName}>Tennis</Text>
              </View>
              <View>    
                  <TouchableOpacity style={styles.RoundButton} onPress={()=>{setGame({...Game,Rugby:!Game.Rugby})}}>
                    {Game.Rugby==true
                        ?<LinearGradient style={styles.RoundButton} colors={['#F4A58A', '#ED6B4E']} start={{x: 0.35, y: 0.35}} end={{x: 0.8, y: 1.0}}>
                          <Rugby/>
                        </LinearGradient>
                        :<Rugby/>
                    }
                  </TouchableOpacity>
                  <Text style={styles.GameName}>Volleyball</Text>
              </View>
          </View>
        </View>
      </View>
      <View style={{marginTop:30}}>
          {/* <Button title="Button" onPress={()=>{} }></Button> */}
          <Text style={{textAlign: 'center',color: 'white' ,fontSize:18}} onPress={()=>{updateInterest()}}>Next</Text>
      </View>
    </ScrollView>
    
  )
}

const styles = StyleSheet.create({
  MainBody:{
    backgroundColor: '#181829',
    color: 'black',
  },
  Container:{
    marginLeft:28,
    marginRight:28,
  },
  Heading:{
    marginTop:90,
    fontSize:36,
    color: 'white'
  },
  SubHeading:{
    marginTop:14,
    fontSize:16,
    color:'#65656B',
  },
  RoundButton:{
    backgroundColor:'#222232',
    height:92,
    width:92,
    borderRadius:46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  GameName:{
    fontSize:18,
    fontWeight:'bold',
    textAlign: 'center',
    color: 'white'
  }
})