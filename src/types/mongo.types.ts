import mongoose, { Document, Types } from "mongoose";

export interface IComboGoal extends Document {
  userId: Types.ObjectId;
  notes: string;
  goal: string;
}

export interface IMilestoneCategoryUI extends Document {
  title: string;
  imageUrl: string;
}

export interface IComment {
  _id?: mongoose.Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
  createdAt?: Date;
}

export interface IPost extends Document {
  userId: Types.ObjectId;
  title: string;
  description: string;
  imageLink?: string;
  videoLink?: string;
  likedBy: Types.ObjectId[];
  comments: IComment[];
  pinnedBy: Types.ObjectId[]
  postType: string
}

export interface ISessionPlanner extends Document {
  userId: Types.ObjectId;
  date: Date;
  title: string;
  note?: string;
  color?: string;
  review?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITrickingMilestoneLevel extends Document {
  title: string;
  imageUrl: string;
  level: number;
}


export interface ITrackingProgress extends Document {
  userId: Types.ObjectId;
  trickingMilestoneLevelId: Types.ObjectId;
  trickingMilestoneTrickId: Types.ObjectId;
  status: "pending" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface ITrickingMilestoneTrick extends Document {
  trickingMilestoneLevelId: Types.ObjectId;
  title: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface IKeypoint {
  _id?: Types.ObjectId;
  text: string;
}

export interface IStep {
  title: string;
  keypoints: IKeypoint[];
  videoLinks: IVideoLink[];
}

export interface IVideoLink {
  type: string; // e.g., "tutorial", "demo", "slow motion"
  link: string;
  thumbnail:string
}

export interface ITrickData extends Document {
  name: string;
  trickVaultId: Types.ObjectId;
  image?: string;
  typeId: Types.ObjectId;
  userId: Types.ObjectId;
  description?: string;
  steps: IStep[];
  videoLinks: IVideoLink[];
}


export interface ITrickType {
  name: string;
}

export interface ITrickVault extends Document {
  name: string;
  description?: string;
  imageLink?: string;
  isFeatured: boolean;
  types: ITrickType[];
}


export interface IProgressItem {
  stepId: Types.ObjectId;
  isSaved: boolean;
  repsCount: number;  
  status: "completed" | "attempted" | "pending";
  isVideoViewed:boolean;
  timeTaken?: number; // in seconds
}

export interface IUserProgress extends Document {
  userId: Types.ObjectId;
  trickVaultId: Types.ObjectId;
  trickDataId: Types.ObjectId;
  typeId: Types.ObjectId;
  progress: IProgressItem[];
}

export interface IPersonalBest extends Document {
  gainerSwitch: number;
  corks: number
}

export interface IClipReview extends Document {
  videoUrl: string;
  notes: string;
  feedBack: string;
  userId: Types.ObjectId;
  status: "reviewed" | "pending";
  title: string
}

