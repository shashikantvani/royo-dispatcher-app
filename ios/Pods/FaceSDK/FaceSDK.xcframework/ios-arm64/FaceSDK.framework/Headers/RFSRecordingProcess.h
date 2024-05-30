//
//  RFSRecordingProcess.h
//  FaceSDK
//
//  Created by Dmitry Evglevsky on 2.10.23.
//  Copyright © 2023 Regula. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_CLOSED_ENUM(NSInteger, RFSRecordingProcess) {
    /// Video will be recorded and send in parallel with the main request to liveness service.
    RFSRecordingProcessAsynchronousUpload,
    /// Video will be recorded, packaged and sent in one request to liveness service.
    RFSRecordingProcessSynchronousUpload,
    /// Video will not be recorder.
    RFSRecordingProcessNotUpload
} NS_SWIFT_NAME(RecordingProcess);
