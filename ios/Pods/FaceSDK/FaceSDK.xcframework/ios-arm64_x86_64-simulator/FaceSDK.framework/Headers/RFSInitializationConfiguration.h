//
//  RFSInitializationConfiguration.h
//  FaceSDK
//
//  Created by Dmitry Evglevsky on 29.11.23.
//  Copyright © 2023 Regula. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <FaceSDK/RFSBaseConfiguration.h>

NS_ASSUME_NONNULL_BEGIN

NS_SWIFT_NAME(InitConfigurationBuilder)
@interface RFSInitializationConfigurationBuilder: RFSBaseConfigurationBuilder
@end

NS_SWIFT_NAME(InitializationConfiguration)
@interface RFSInitializationConfiguration : RFSBaseConfiguration<RFSInitializationConfigurationBuilder *> <NSObject>

@property(readonly, nonatomic, assign) BOOL licenseUpdate;
@property(readonly, nonatomic, strong, nonnull) NSData *licenseData;

@end

@interface RFSInitializationConfigurationBuilder ()

@property(readwrite, nonatomic, assign) BOOL licenseUpdate;
@property(readwrite, nonatomic, strong, nonnull) NSData *licenseData;

@end

NS_ASSUME_NONNULL_END
