import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const signupUser = createAsyncThunk(
  "eLearning/signedupUser",
  async (user) => {
    return await axios
      .post(`api/users/`, user, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const signinUser = createAsyncThunk(
  "users/loggedUser",
  async (userData) => {
    return await axios
      .post("/auth/signin", userData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const signoutUser = createAsyncThunk("users/user", async () => {
  const response = await axios.post("/auth/signout");
  return response.data;
});

export const userToken = createAsyncThunk("users/protected", async () => {
  return await axios
    .get("/protected", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((response) => response.data)
    .catch((error) => error.message);
});

export const fetchUserData = createAsyncThunk(
  "eLearning/loggedUser",
  async (id) => {
    return await axios
      .get(`/api/users/${id}`)
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const reLoginUser = createAsyncThunk(
  "eLearning/loggedUser",
  async (id) => {
    return await axios
      .get(`/api/users/relogin/${id}`)
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const updateUserData = createAsyncThunk(
  "users/updateUserData",
  async (user) => {
    return await axios
      .put(`/api/users/${user.param}`, user.data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);
export const updateUserDataByAdmin = createAsyncThunk(
  "users/updateUserData",
  async (user) => {
    return await axios
      .put(`/api/users/${user.param}`, user.data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);
export const updateUserPassword = createAsyncThunk(
  "eLearning/updatePassword",
  async (user) => {
    return await axios
      .put(`api/users/updateUserPassword/${user.param}`, user.data, {
        header: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const closeAccount = createAsyncThunk(
  "users/closeAccountStatus",
  async (user) => {
    const response = await axios.delete(`/api/users/${user.param}`, user, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
);
export const fetchUserCourses = createAsyncThunk(
  "/eLearning/userCourses",
  async (user) => {
    return await axios
      .post(`/api/userCourses`, {
        userCourses: user.userCourses,
        completedCourses: user.completedCourses,
        filterTerm: user.filterTerm || undefined,
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const fetchMentorCourses = createAsyncThunk(
  "/eLearning/mentorCourses",
  async (courses) => {
    return await axios
      .post(`/api/mentorCourses`, {
        mentorId: courses.mentorId,
        firstItem: courses.firstItem,
        lastItem: courses.lastItem,
        filterTerm: courses.filterTerm,
        status: courses.status,
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const createCourse = createAsyncThunk(
  "eLearning/createCourse",
  async (course) => {
    return await axios
      .post(`/api/courses`, course, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);
export const updateCourse = createAsyncThunk(
  "eLearning/updateCourse",
  async (course) => {
    return await axios
      .put(`/api/course/${course.param}`, course.data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const updateUser = createAsyncThunk(
  "eLearning/updateUser",
  async (user) => {
    return await axios
      .put(`/api/transaction/${user.param}`, user.data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);
export const removeCourse = createAsyncThunk(
  "eLearning/deleteCourse",
  async (param) => {
    const response = await axios.post(`/admin/course/${param}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
);

export const removeUser = createAsyncThunk(
  "eLearning/deleteUser",
  async (param) => {
    const response = await axios.post(`/admin/user/${param}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
);

export const fetchUserCourseData = createAsyncThunk(
  "users/transactionData",
  async (param) => {
    return await axios
      .get(`/api/transaction/${param}`)
      .then((response) => response.data)
      .catch((error) => error);
  }
);
//upload image
export const uploadImage = createAsyncThunk(
  "library/uploadImage",
  async (file) => {
    return await axios
      .post("/uploadImage", file)
      .then((response) => response.data)
      .catch((error) => error);
  }
);

// admin
export const fetchAllUsers = createAsyncThunk(
  "eLearning/allUsers",
  async () => {
    return await axios
      .get(`/admin/users`)
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const fetchFilteredCourses = createAsyncThunk(
  "eLearning/courses",
  async (courses) => {
    return await axios
      .post(`/admin/courses`, {
        filterTerm: courses.filterTerm,
        filterLevel: courses.filterLevel || undefined,
        filterDuration: courses.filterDuration || undefined,
        page: courses.page,
        firstValue: courses.firstItem,
        lastValue: courses.lastItem,
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const fetchCourses = createAsyncThunk(
  "eLearning/courses",
  async (courses) => {
    return await axios
      .post(`/admin/courses`, {
        filterTerm: courses.filterTerm,
        filterLevel: courses.filterLevel || undefined,
        filterDuration: courses.filterDuration || undefined,
        page: courses.page,
        firstValue: courses.firstItem,
        lastValue: courses.lastItem,
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const fetchUsers = createAsyncThunk("eLearning/users", async (users) => {
  return await axios
    .post(`/admin/users`, {
      firstValue: users.firstItem,
      lastValue: users.lastItem,
      filterTerm: users.filterTerm,
    })
    .then((response) => response.data)
    .catch((error) => error);
});

export const activateAccount = createAsyncThunk(
  "eLearning/activateAccount",
  async (user) => {
    return await axios
      .put(`/admin/users/${user.param}`, {
        userStatus: user.userStatus,
        role: user.role,
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const enrollInCourse = createAsyncThunk(
  "eLearning/enrollInCourse",
  async (user) => {
    return await axios
      .post(`/api/users/${user.param}`, {
        id: user.id,
        courseId: user.courseId,
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const completeCourse = createAsyncThunk(
  "eLearning/completedCourse",
  async (user) => {
    return await axios
      .post(`/api/completedCourses`, {
        id: user.id,
        courseId: user.courseId,
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const fetchMentors = createAsyncThunk(
  "eLearning/allMentors",
  async () => {
    return await axios
      .get(`/api/mentors`)
      .then((response) => response.data)
      .catch((error) => error);
  }
);

export const createUser = createAsyncThunk(
  "eLearning/createUser",
  async (user) => {
    return await axios
      .post(`/admin/createUser`, user, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => error);
  }
);

const initialState = {
  // user data
  singinUserForm: false,
  singupUserForm: false,
  signedupUser: {},
  editUserForm: false,
  editUserPasswordForm: false,
  uploadImage: {},
  updatePassword: {},
  closeAccountForm: false,
  closeAccountModal: false,
  userData: {},
  updateUser: {},
  loggedUser: {},
  signedOut: {},
  userToken: {},
  userDataToDisplay: {},
  closeAccountStatus: {},
  passwordCheck: {},
  deleteAccountModal: true,
  deleteUser: {},
  // admin
  allUsers: {},
  usersDisplayPage: 1,
  allCourses: {},
  coursesDisplayPage: 1,
  courses: {},
  users: {},
  updateCourse: {},
  activateAccount: {},
  createUser: {},
  studentFilters: {},
  mentorFilters: {},
  adminFilters: {},
  // courses
  userCourses: {},
  dashboardData: [],
  addCourse: {},
  filterTerm: "",
  updatedUserCourse: {},
  deleteCourse: {},
  userCourseData: {},
  courseToEdit: {},
  userToEdit: {},
  addCourse: {},
  courseOverviewModal: [],
  displayUserCourses: false,
  completedCourse: {},
  allMentors: {},
  mentorCourses: {},
  selectedFilterTerm: "",
  courseDeleteModal: false,
  store: {},
  selectedLevelFilter: Array(4).fill(false),
  selectedDurationFilter: Array(6).fill(false),
};

const eLearningSlice = createSlice({
  name: "eLearning",
  initialState,
  reducers: {
    setSigninUserForm: (state, action) => {
      state.singinUserForm = action.payload;
    },
    setSignupUserForm: (state, action) => {
      state.singupUserForm = action.payload;
    },
    setEditUserProfileForm: (state, action) => {
      state.editUserForm = action.payload;
    },
    setEditUserPasswordForm: (state, action) => {
      state.editUserPasswordForm = action.payload;
    },
    clearUpdatePassword: (state, action) => {
      state.updatePassword = {};
    },
    setCloseAccountForm: (state, action) => {
      state.closeAccountForm = action.payload;
    },
    setCloseAccountModal: (state, action) => {
      state.closeAccountModal = action.payload;
    },
    cleanSignupMessage: (state, action) => {
      state.signedupUser = {};
    },
    cleanLoginMessage: (state, action) => {
      state.loggedUser = {};
    },
    cleanUpdatedUserDataStatus: (state, action) => {
      state.updateUser = {};
    },
    cleanPasswordCheckData: (state, action) => {
      state.passwordCheck = {};
    },
    userDataToDisplay: (state, action) => {
      state.userDataToDisplay = action.payload;
    },
    dashboardData: (state, action) => {
      state.dashboardData = [...state.dashboardData, action.payload];
    },
    cleanCourseData: (state, action) => {
      state.addCourse = {};
    },
    cleanUserUpdateMessage: (state, action) => {
      state.updateUser = {};
    },
    cleanCourseUpdatedMessage: (state, action) => {
      state.updateCourse = {};
    },
    cleanUserFetchDataStatus: (state, action) => {
      delete state.loggedUser["message"];
    },
    setFilter: (state, action) => {
      state.filterTerm = action.payload;
    },
    cleanFilterTerm: (state, action) => {
      state.filterTerm = "";
      state.selectedFilterTerm = "";
    },
    cleanDeleteCourseMessage: (state, payload) => {
      state.deleteCourse = {};
    },
    setCoursesOverviewLevel: (state, action) => {
      state.transactionsOverviewLevel = action.payload;
    },
    setStatisticsOverviewLevel: (state, action) => {
      state.statisticsOverviewLevel = action.payload;
    },
    setDeleteAccountModal: (state, action) => {
      state.deleteAccountModal = action.payload;
    },
    setUsersDisplayPage: (state, action) => {
      state.usersDisplayPage = action.payload;
    },
    setCoursesDisplayPage: (state, action) => {
      state.coursesDisplayPage = action.payload;
    },
    setCourseToEdit: (state, action) => {
      state.courseToEdit =
        Object.keys(state.courses).length !== 0
          ? Object.values(state.courses.data).filter(
              (item) => item._id === action.payload
            )[0]
          : Object.values(state.mentorCourses.data).filter(
              (item) => item._id === action.payload
            )[0];
    },
    setUserToEdit: (state, action) => {
      state.userToEdit = Object.values(state.users.data).filter(
        (item) => item._id === action.payload
      )[0];
    },
    setLoggedUserToEdit: (state, action) => {
      state.userToEdit = action.payload;
    },
    cleanUploadImageStatus: (state, action) => {
      state.uploadImage = {};
    },
    cleanAddCourseMessage: (state, action) => {
      state.addCourse = {};
    },
    cleanActivateAccountMessage: (state, action) => {
      state.activateAccount = {};
    },
    setShowModalCourseWindow: (state, action) => {
      state.courseOverviewModal[action.payload] =
        !state.courseOverviewModal[action.payload];
    },
    setDisplayUserCourses: (state, action) => {
      state.displayUserCourses = action.payload;
    },
    cleanCompletedCourseMessage: (state, action) => {
      state.completedCourse = {};
    },
    cleanEnrollInCourseMessage: (state, action) => {
      state.enrollInCourse = {};
    },
    setFilterTerm: (state, action) => {
      state.selectedFilterTerm = state.filterTerm;
    },
    setCourseDeleteModal: (state, action) => {
      state.courseDeleteModal = action.payload;
    },
    incrementNumOfCourses: (state, action) => {
      state.loggedUser.courseNum += 1;
    },
    cleanCreateUserStatus: (state, action) => {
      state.createUser = {};
    },
    setStudentFilters: (state, action) => {
      state.studentFilters = action.payload;
    },
    setMentorFilters: (state, action) => {
      state.mentorFilters = action.payload;
    },
    setAdminFilters: (state, action) => {
      state.adminFilters = action.payload;
    },
    cleanReloginStatus: (state, action) => {
      delete state.loggedUser["relogin"];
    },
    setUserToken: (state, action) => {
      state.userToken = action.payload;
    },
    setLoggedUserStatus: (state, action) => {
      state.loggedUser = "signout";
    },
    setStoreStatus: (state, action) => {
      state.storeStatus = action.payload;
    },
    setClearSignoutUserMessage: (state, action) => {
      state.loggedUser = {};
    },
    setLevelFilter: (state, action) => {
      let arr = Array(4).fill(false);
      state.selectedLevelFilter = arr;
      state.selectedLevelFilter[action.payload] =
        !state.selectedLevelFilter[action.payload];
    },
    setDurationFilter: (state, action) => {
      let arr = Array(6).fill(false);
      state.selectedDurationFilter = arr;
      state.selectedDurationFilter[action.payload] =
        !state.selectedDurationFilter[action.payload];
    },
    //reset store state after logout or delete of account
    cleanStore: () => initialState,
  },
  extraReducers: {
    [signupUser.fulfilled]: (state, { payload }) => {
      return { ...state, signedupUser: payload };
    },
    [signinUser.fulfilled]: (state, { payload }) => {
      return { ...state, loggedUser: payload };
    },
    [signoutUser.fulfilled]: (state, { payload }) => {
      return { ...state, signedOut: payload };
    },
    [userToken.fulfilled]: (state, { payload }) => {
      return { ...state, userToken: payload };
    },
    [fetchUserData.fulfilled]: (state, { payload }) => {
      return { ...state, loggedUser: payload };
    },
    [updateUserData.fulfilled]: (state, { payload }) => {
      if (payload.error) {
        return {
          ...state,
          updateUser: payload,
        };
      }

      return {
        ...state,
        updateUser: payload,
        loggedUser: {
          token: payload.token,
          user: payload.data,
        },
      };
    },
    [updateUserDataByAdmin.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        updateUser: payload,
      };
    },
    [closeAccount.fulfilled]: (state, { payload }) => {
      return { ...state, closeAccountStatus: payload };
    },
    [updateUserPassword.fulfilled]: (state, { payload }) => {
      return { ...state, updatedUserData: payload };
    },
    // Courses
    [fetchUserCourses.fulfilled]: (state, { payload }) => {
      return { ...state, userCourses: payload };
    },
    [createCourse.fulfilled]: (state, { payload }) => {
      return { ...state, addCourse: payload };
    },
    [updateUser.fulfilled]: (state, { payload }) => {
      return { ...state, updatedUser: payload };
    },
    [updateCourse.fulfilled]: (state, { payload }) => {
      return { ...state, updateCourse: payload };
    },
    [fetchUserCourseData.fulfilled]: (state, { payload }) => {
      return { ...state, userCourseData: payload };
    },
    [removeCourse.fulfilled]: (state, { payload }) => {
      return { ...state, deleteCourse: payload };
    },
    [uploadImage.fulfilled]: (state, { payload }) => {
      return { ...state, uploadImage: payload };
    },
    [updateUserPassword.fulfilled]: (state, { payload }) => {
      return { ...state, updatePassword: payload };
    },
    // admin
    [fetchAllUsers.fulfilled]: (state, { payload }) => {
      return { ...state, allUsers: payload };
    },

    [fetchCourses.fulfilled]: (state, { payload }) => {
      return { ...state, courses: payload };
    },
    [fetchUsers.fulfilled]: (state, { payload }) => {
      return { ...state, users: payload };
    },
    [activateAccount.fulfilled]: (state, { payload }) => {
      return { ...state, activateAccount: payload };
    },
    [enrollInCourse.fulfilled]: (state, { payload }) => {
      return { ...state, enrollInCourse: payload };
    },
    [completeCourse.fulfilled]: (state, { payload }) => {
      return { ...state, completedCourse: payload };
    },
    [fetchMentors.fulfilled]: (state, { payload }) => {
      return { ...state, allMentors: payload };
    },
    [fetchMentorCourses.fulfilled]: (state, { payload }) => {
      return { ...state, mentorCourses: payload };
    },
    [createUser.fulfilled]: (state, { payload }) => {
      return { ...state, createUser: payload };
    },
    [reLoginUser.fulfilled]: (state, { payload }) => {
      return { ...state, loggedUser: payload };
    },
  },
});

export const getSigninUserFormStatus = (state) =>
  state.eLearning.singinUserForm;
export const getSignupUserFormStatus = (state) =>
  state.eLearning.singupUserForm;
export const getSignedUser = (state) => state.eLearning.signedupUser;
export const getLoggedUserData = (state) => state.eLearning.loggedUser;
export const getEditUserFormStatus = (state) => state.eLearning.editUserForm;
export const getEditUserPasswordFormStatus = (state) =>
  state.eLearning.editUserPasswordForm;
export const getUploadUserImageStatus = (state) => state.eLearning.uploadImage;
export const getUpdateUserPasswordStatus = (state) =>
  state.eLearning.updatePassword;
export const getCloseAccountFormStatus = (state) =>
  state.eLearning.closeAccountForm;
export const getCloseAccountModalStatus = (state) =>
  state.eLearning.closeAccountModal;
export const getUserToken = (state) => state.eLearning.userToken;
export const getErrors = (state) => state.eLearning.showErrors;
export const getUserData = (state) => state.eLearning.userData;
export const getUpdateUserStatus = (state) => state.eLearning.updateUser;
export const getCloseAccountStatus = (state) =>
  state.eLearning.closeAccountStatus;
export const getPasswordCheckData = (state) => state.eLearning.passwordCheck;
export const getUserDataToDisplay = (state) =>
  state.eLearning.userDataToDisplay;
export const getDeleteAccountModal = (state) =>
  state.eLearning.closeAccountModal;
export const getUserToEdit = (state) => state.eLearning.userToEdit;
///
export const getUserCourses = (state) => state.eLearning.userCourses;
export const getDashboardData = (state) => state.eLearning.dashboardData;
export const getCourseData = (state) => state.eLearning.addCourse;
export const getFilter = (state) => state.eLearning.filterTerm;
export const getUsersDisplayPage = (state) => state.eLearning.usersDisplayPage;
export const getCoursesDisplayPage = (state) =>
  state.eLearning.coursesDisplayPage;
export const getUpdateCourseStatus = (state) => state.eLearning.updateCourse;
export const getDeleteUserMessage = (state) => state.eLearning.deleteUser;

export const getUserCourseData = (state) => state.eLearning.userCourseData;
export const getDeleteId = (state) => state.eLearning.deleteId;
export const getOpenDeleteModal = (state) => state.eLearning.openDeleteModal;
export const getDeleteCourseMessage = (state) => state.eLearning.deleteCourse;
export const getCoursesOverviewLevel = (state) =>
  state.eLearning.transactionsOverviewLevel;
export const getCourseToEdit = (state) => state.eLearning.courseToEdit;
export const getCreateCourseMessage = (state) => state.eLearning.addCourse;
export const getSignedOutUserStatus = (state) => state.eLearning.signedOut;

export const getCourseOverviewModal = (state) =>
  state.eLearning.courseOverviewModal;
export const getDisplayUserCoursesStatus = (state) =>
  state.eLearning.displayUserCourses;
export const getEnrollInCourseMessage = (state) =>
  state.eLearning.enrollInCourse;
export const getCompletedCourseMessage = (state) =>
  state.eLearning.completedCourse;
export const getCourseDeleteModalStatus = (state) =>
  state.eLearning.courseDeleteModal;
export const getStoreStatus = (state) => state.eLearning.storeStatus;

// admin
export const getUsers = (state) => state.eLearning.users;
export const getCourses = (state) => state.eLearning.courses;
export const getActivateAccountMessage = (state) =>
  state.eLearning.activateAccount;
export const getAllMentors = (state) => state.eLearning.allMentors;
export const getMentorCourses = (state) => state.eLearning.mentorCourses;
export const getSelectedFilterTerm = (state) =>
  state.eLearning.selectedFilterTerm;
export const getCreateUserStatus = (state) => state.eLearning.createUser;
export const getStudentFilters = (state) => state.eLearning.studentFilters;
export const getMentorFilters = (state) => state.eLearning.mentorFilters;
export const getAdminFilters = (state) => state.eLearning.adminFilters;
export const getSelectedLevelFilter = (state) =>
  state.eLearning.selectedLevelFilter;
export const getSelectedDurationFilter = (state) =>
  state.eLearning.selectedDurationFilter;

export const {
  setSigninUserForm,
  setSignupUserForm,
  setEditUserProfileForm,
  setEditUserPasswordForm,
  clearUpdatePassword,
  setCloseAccountForm,
  setCloseAccountModal,
  cleanRegisteredUserData,
  cleanUpdatedUserData,
  cleanPasswordCheckData,
  dashboardData,
  cleanCourseData,
  setFilter,
  cleanCourseUpdatedData,
  setOpenDeleteModal,
  cleanDeleteCourseData,
  setCoursesOverviewLevel,
  setStatisticsOverviewLevel,
  setDeleteAccountModal,
  cleanStore,
  cleanLoginMessage,
  cleanSignupMessage,
  cleanUploadImageStatus,
  cleanAddCourseMessage,
  //admin
  setUsersDisplayPage,
  setCoursesDisplayPage,
  cleanDeleteCourseMessage,
  cleanCourseUpdatedMessage,
  cleanUserUpdateMessage,
  setCourseToEdit,
  setUserToEdit,
  cleanActivateAccountMessage,
  setShowModalCourseWindow,
  setDisplayUserCourses,
  cleanEnrollInCourseMessage,
  cleanCompletedCourseMessage,
  setFilterTerm,
  setCourseDeleteModal,
  incrementNumOfCourses,
  cleanFilterTerm,
  cleanCreateUserStatus,
  setStudentFilters,
  setAdminFilters,
  setMentorFilters,
  cleanUserFetchDataStatus,
  setLoggedUserToEdit,
  cleanReloginStatus,
  setUserToken,
  setLoggedUserStatus,
  setStoreStatus,
  setClearSignoutUserMessage,
  setLevelFilter,
  setDurationFilter,
} = eLearningSlice.actions;

export default eLearningSlice.reducer;
