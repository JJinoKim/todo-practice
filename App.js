import React from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions, Platform , TextInput, ScrollView, AsyncStorage} from 'react-native';
import { AppLoading } from "expo"
import ToDo from "./ToDo";
import uuidv1 from "uuid/v1";

const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newTodo : "",
    loadedToDos : false,
    toDos : {}
  }
  componentDidMount = () =>{
    this._loadToDos();
  }

  render() {
    const {newTodo, loadedToDos, toDos } = this.state;
    if(loadedToDos){
      return <AppLoading />
    }
    
    return (
      <View style={styles.container}>
        <StatusBar 
          barStyle = "light-content"
        />
        <Text style={styles.title}  >Kawai To do</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder={"New To Do"} 
            value={newTodo}
            onChangeText={this._controllNewTodo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addTodo}
            /> 
            <ScrollView contentContainerStyle={styles.toDos}>
              {Object.values(toDos).reverse().map(toDo => (
                <ToDo 
                  key={toDo.id}  
                  deleteToDo={this._deleteToDo}
                  uncompletedToDo = {this._uncompletedToDo}
                  completeToDo = {this._completeToDo}
                  updateToDoFunc ={this._updateToDo}
                  {...toDo}
                  />
              ))}
            </ScrollView>
        </View>
      </View>
    );
  }
  _controllNewTodo = text =>{
    this.setState({
      newTodo : text
    });
  }
  _loadToDos = async () =>{
    try{
      const toDos =  await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      this.setState({ loadedToDos :true, toDos : parsedToDos });
    }catch(err){
      console.log(err);
    }
    this.setState({
      loadedToDos : true
    });
  }
  _addTodo = () =>{
    const { newTodo } = this.state;
    if(newTodo !== ""){
      this.setState(prevState =>{
        const ID = uuidv1();
        const newTodoObject ={
          [ID]:{
            id : ID,
            isComplete:false,
            text:newTodo,
            createdAt : Date.now()
          }
        };
        const newState = {
          ...prevState,
          newTodo : "",
          toDos:{
            ...prevState.toDos,
            ...newTodoObject
          }
          
        }
        this._saveToDos(newState.toDos)
        return {...newState};
      });
    }
  };
  _deleteToDo = (id) =>{
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState ={
        ...prevState,
        ...toDos
      }
      this._saveToDos(newState.toDos)
      return {...newState}
    })
  }

  _uncompletedToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            isComplete : false
          }
        }
      };
      this._saveToDos(newState.toDos)
      return { ...newState };
    });
  }
  _completeToDo = id =>{
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            isComplete : true
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  }

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            text : text
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  }

  _saveToDos = newTodo => {
    const _saveToDos = AsyncStorage.setItem("toDos",JSON.stringify(newTodo));
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center'
  },
  title : {
    color : "white" ,
    fontSize : 30,
    marginTop : 50,
    fontWeight : '200',
    marginBottom : 30
  },
  card : {
    backgroundColor : "white",
    flex : 1,
    width: width - 25,
    borderTopLeftRadius : 10,
    borderTopRightRadius : 10,
    ...Platform.select({
      ios:{
        shadowColor : "rgb(50,50,50)",
        shadowOpacity : 0.5,
        shadowRadius : 5,
        shadowOffset:{
          height : -1,
          width : 0
        }
      },
      android:{
        elevation : 3
      }
    })
  },
  input : {
    padding : 20,
    borderBottomColor : "#bbb",
    borderBottomWidth : 1,
    fontSize : 25
  },
  toDos : {
    alignItems : "center"
  }
});
