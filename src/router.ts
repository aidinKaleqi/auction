import { AuctionModule } from './module/auction/auction.module';
import { UserModule } from './module/user/user.module';

export const Routes = [
  {
    path: '/auctions',
    module: AuctionModule,
  },
    {
    path: '/users',
    module: UserModule,
  },
];
