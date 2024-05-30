//
//  RFSMatchFacesConfiguration.h
//  FaceSDK
//
//  Created by Dmitry Evglevsky on 27.11.23.
//  Copyright © 2023 Regula. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <FaceSDK/RFSBaseConfiguration.h>

typedef NS_CLOSED_ENUM(NSInteger, RFSProcessingMode) {
    RFSProcessingModeOnline,
    RFSProcessingModeOffline
} NS_SWIFT_NAME(FaceSDK.ProcessingMode);

NS_ASSUME_NONNULL_BEGIN

NS_SWIFT_NAME(MatchFacesConfigurationBuilder)
@interface RFSMatchFacesConfigurationBuilder: RFSBaseConfigurationBuilder
@end

NS_SWIFT_NAME(MatchFacesConfiguration)
@interface RFSMatchFacesConfiguration : RFSBaseConfiguration<RFSMatchFacesConfigurationBuilder *> <NSObject>

@property(readonly, nonatomic, assign) RFSProcessingMode processingMode;

@end

@interface RFSMatchFacesConfigurationBuilder ()

@property(readwrite, nonatomic, assign) RFSProcessingMode processingMode;

@end

NS_ASSUME_NONNULL_END
