import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentReview: null,
  comments: [],
  lastId: 0,
};

const review = createSlice({
  name: "review",
  initialState,
  reducers: {
    getReview: (state, action) => {
      state.currentReview = action.payload;
    },
    getComments: (state, action) => {
      if (action.payload.prepend) {
        state.comments = [...action.payload.comments, ...state.comments];
      }
      if (action.payload.append) {
        state.comments = [...state.comments, ...action.payload.comments];
        state.currentReview.review.commentsCount++;
      }
    },
    deleteComment: (state, { payload: { id } }) => {
      state.comments = state.comments.filter(
        ({ comment }) => comment.commentId !== id
      );
      state.currentReview.review.commentsCount--;
    },
    editComment: (state, { payload: { id, text } }) => {
      state.comments = state.comments.map((item) =>
        item.comment.commentId === id
          ? { ...item, comment: { ...item.comment, comment: text } }
          : item
      );
    },
    reactComment: (state, { payload: { updated, id, data, oldEmoji } }) => {
      if (updated) {
        state.comments = state.comments.map((item) =>
          item.comment.commentId === id
            ? {
                ...item,
                comment: {
                  ...item.comment,
                  [oldEmoji + "Count"]: item.comment[oldEmoji + "Count"] - 1,
                  [data.reaction.emoji + "Count"]:
                    item.comment[data.reaction.emoji + "Count"] + 1,
                },
                users: item.users.map((user) =>
                  user.user.id === data.user.id ? data : user
                ),
              }
            : item
        );
      } else {
        state.comments=state.comments.map(item=>item.comment.commentId===id?{...item,comment:{...item.comment,totalEmojiCount:item.comment.totalEmojiCount+1,[data.reaction.emoji+"Count"]:item.comment[data.reaction.emoji+"Count"]+1},users:[...item.users,data]}:item);
      }
    },
    unreactComment:(state,{payload:{id,userId,oldEmoji}})=>{
        state.comments=state.comments.map(item=>item.comment.commentId===id?{...item,comment:{...item.comment,totalEmojiCount:item.comment.totalEmojiCount-1,[oldEmoji+"Count"]:item.comment[oldEmoji+"Count"]-1},users:item.users.filter(({user})=>user.id!==userId)}:item)
    },
    clearComments: (state) => {
      state.comments = [];
    },
    setLastId: (state, action) => {
      state.lastId = action.payload;
    },
  },
});

export const {
  getReview,
  getComments,
  setLastId,
  deleteComment,
  editComment,
  clearComments,
  reactComment,
  unreactComment
} = review.actions;

export default review.reducer;
