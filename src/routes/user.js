const express = require("express"),
  multer = require("multer");

const UserController = require("../controllers/user");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.put("/updatesociallinks/:userid", UserController.updateSocialLinks);

router.put("/updateskills/:userid", UserController.updateSkill);

router.post("/addskill/:userid", UserController.addSkill);

router.get("/getuserskills/:userid", UserController.getUserSkills);

router.get("/getanniversaries", UserController.getAnniversaries);

router.get("/allusers", UserController.getUsersforDirectory);

router.get("/getuserdetials/:id", UserController.getUserDetails);

router.post(
  "/changeprofileimg",
  upload.single("file"),
  UserController.uploadProfileImg
);

router.get("/get_user_detials/:id", UserController.getUserDetails);

router.get("/get_users", UserController.getUsers);

router.get("/search", UserController.searchUsers);

router.get("/listusers", UserController.getUsers);

router.get("/loginusers", UserController.loginUsersToday);

router.get("/:id", UserController.getUser);

router.put("/:id", UserController.updateUser);

router.put("/updateprofileinfo/:id", UserController.updateProfileInfo);

router.put("/updatecontactinfo/:id", UserController.updateContactInfo);

router.post("/", UserController.createNewUsers);

router.delete("/:id", UserController.deleteUser);

router.post("/erroremail", UserController.errorEmailTrigger);

router.put("/activeuseraccount/:id", UserController.activateUserAccount);

router.put("/deactiveuseraccount/:id", UserController.deactivateUserAccount);

router.get("/leavebalace/:id/:leavetype", UserController.getLeaveBlance);

router.get("/userleavebalace/:id", UserController.userLeaveBalace);

router.post("/change_password", UserController.changePassword);

router.get("/getassignedusers/:id", UserController.getAssigendUsers);

module.exports = router;
