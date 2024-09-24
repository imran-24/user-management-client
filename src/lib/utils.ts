import { clsx, type ClassValue } from "clsx"
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export type TableDataTpye = {
  id: string;
  name: string;
  email: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: boolean;
}

export type DataList = TableDataTpye[] | [];