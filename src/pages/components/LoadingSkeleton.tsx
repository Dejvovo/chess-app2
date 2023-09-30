import {Skeleton} from "antd";

const SkeletonItem = () => {
    return <Skeleton.Input style={{width: '90vw', height: '94px', margin: '6px 0'}} active/>
}
export const LoadingSkeleton = () => {
  return(
      <div style={{marginTop: '20px'}}>
        <SkeletonItem/>
        <SkeletonItem/>
        <SkeletonItem/>
        <SkeletonItem/>
        <SkeletonItem/>
        <SkeletonItem/>
        <SkeletonItem/>
        <SkeletonItem/>
      </div> )
}