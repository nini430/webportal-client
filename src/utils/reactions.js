export const reactions = [{name:"like",emoji:'👍'},{name:"heart",emoji:'❤️'}, {name:"haha",emoji:'😆'},{ name:"sad", emoji: '😢'}, {name:"angry",emoji:'😡'}];

export const getReaction=(name)=>{
    return reactions.find(item=>item.name===name).emoji;
}


export const getReactionName=(emoji)=>{
    return reactions.find(item=>item.emoji===emoji).name;
}

