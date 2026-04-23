import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  async create(recipientId: string, recipientRole: string, title: string, message: string) {
    const notification = new this.notificationModel({
      recipientId,
      recipientRole,
      title,
      message,
    });
    return notification.save();
  }

  async getMyNotifications(userId: string) {
    return this.notificationModel
      .find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationModel.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { recipientId: userId, isRead: false },
      { isRead: true }
    );
  }
}
