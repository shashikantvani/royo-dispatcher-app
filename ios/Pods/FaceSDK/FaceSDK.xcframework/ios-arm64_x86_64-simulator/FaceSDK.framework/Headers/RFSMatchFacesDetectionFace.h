//
//  RFSMatchFacesDetectionFace.h
//  FaceSDK
//
//  Created by Pavel Kondrashkov on 23/11/2021.
//  Copyright © 2021 Regula. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <FaceSDK/RFSMacros.h>

NS_ASSUME_NONNULL_BEGIN

@class RFSPoint;
@class UIImage;

/// `RFSMatchFacesDetectionFace` represents face detection information as a part of `RFSMatchFacesResponse`.
NS_SWIFT_NAME(MatchFacesDetectionFace)
@interface RFSMatchFacesDetectionFace : NSObject

/// The index of the face detection object in the array of detections.
@property(nonatomic, readonly, strong, nonnull) NSNumber *faceIndex;

/// Main coordinates of the detected face (eyes, nose, lips, ears and etc.).
@property(nonatomic, readonly, strong, nonnull) NSArray<RFSPoint *> *landmarks;

/// Rectangular area of the detected face in the original image.
@property(nonatomic, readonly, assign) CGRect faceRect;

/// Rotation is measured counterclockwise in degrees, with zero indicating that a line drawn between the eyes is horizontal relative to the image orientation.
@property(nonatomic, readonly, strong, nullable) NSNumber *rotationAngle;

/// Base64 image of the aligned and cropped portrait.
/// Returned if `RFSMatchFacesRequest.outputImageParams` is set or predefined scenario is used.
@property(nonatomic, readonly, strong, nullable) UIImage *crop;

/// Coordinates of the rectangle with the face on the original image prepared for the face crop.
/// Requires `RFSOutputImageCrop.returnOriginalRect` is set.
/// Returns 'CGRectZero' if `RFSOutputImageCrop.returnOriginalRect` isn't set.
@property(nonatomic, readonly, assign) CGRect originalRect;

RFS_EMPTY_INIT_UNAVAILABLE

@end

NS_ASSUME_NONNULL_END
