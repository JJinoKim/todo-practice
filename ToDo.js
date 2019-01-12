import React,{ Component } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput} from "react-native"
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window")

export default class ToDo extends Component{
    constructor(props){
        super(props);
        this.state = { isEditing: false, todoValue : props.text}
    }
    static propTypes = {
        text : PropTypes.string.isRequired,
        isComplete : PropTypes.bool.isRequired,
        deleteToDo : PropTypes.func.isRequired,
        id : PropTypes.string.isRequired,
        uncompletedToDo  : PropTypes.func.isRequired,
        completeToDo : PropTypes.func.isRequired,
        updateToDoFunc : PropTypes.func.isRequired
    }
    state = {
        isEditing : false,
        todoValue : ""
    };
    render(){
        const { isEditing, todoValue} = this.state;
        const { text, id , deleteToDo, isComplete } = this.props;
        return(
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._toggleComplete}>
                        <View style={[styles.circle, isComplete ? styles.completedCircle : styles.uncompletedCircle]} />
                    </TouchableOpacity>
                    {isEditing ? 
                        (<TextInput 
                            style={[
                                styles.input, 
                                styles.text, 
                                isComplete ? styles.completedText : styles.uncompletedText
                                ]} 
                            value={todoValue} 
                            multiline={true} 
                            onChangeText = {this._controllInput}
                            returnKeyType ={"done"}
                            onBlur={this._finishEditing}
                            />
                        ) : 
                        (<Text style={[
                                styles.text, 
                                isComplete ? styles.completedText : styles.uncompletedText 
                                ]}>
                            {text}
                        </Text>)}
                    </View>
                    {isEditing ? (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._finishEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>✅</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._startEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>✏️</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPressOut={()=> deleteToDo(id) }>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>❌</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
        );
    }

    _toggleComplete = () =>{
        const { isComplete, uncompletedToDo, completeToDo, id} = this.props;
        
        if(isComplete){
            uncompletedToDo(id);
        }else{
            completeToDo(id);
        }
    };

    _startEditing = () =>{
        this.setState({isEditing : true});
    };

    _finishEditing = () =>{
        const {todoValue} = this.state;
        const { id, updateToDoFunc } = this.props;
        
        updateToDoFunc(id, todoValue);
        this.setState({
            isEditing : false
        })
    };
    _controllInput = (text) =>{
        this.setState({ todoValue : text });
    }


    
}

const styles = StyleSheet.create({
    container : {
        width : width -50,
        borderBottomColor : "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between"
    },
    circle : {
        width : 30,
        height : 30,
        borderRadius : 15,
        borderColor : "red",
        borderWidth : 3,
        marginRight : 20
    },
    text : {
        fontWeight : "600",
        fontSize : 20,
        marginVertical : 20
    },
    completedCircle :{
        borderColor  : "#bbb"
    },
    uncompletedCircle : {
        borderColor : "#F23657"
    },
    completedText : {
        color : "#bbb",
        textDecorationLine : "line-through"
    },
    uncompletedText : {
        color : "#353839"
    },
    column : {
        flexDirection : "row",
        alignItems : "center",
        width : width / 2,
        justifyContent : "space-between"
    },
    actions : {
        flexDirection : "row",

    },
    actionContainer : {
        marginVertical : 10,
        marginHorizontal  : 10
    },
    input : {
        marginVertical : 10,
        width : width /2

    }
});