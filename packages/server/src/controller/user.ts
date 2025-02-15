import { createRouter } from '../common/createRouter';
import { catchAsyncErr, genJwt, isEmpty } from '../common/utils';
import { Yu, YuStatus } from '../common/yu';
import { UserModel } from '../model';

// 14天
const cookieExpires = new Date(Date.now() + 14 * 86400000);

export const UserController = createRouter('/user', (r) => {
  r.post(
    '/register',
    catchAsyncErr(async (req, res) => {
      if (!UserModel.check(req.body)) {
        res.json(Yu.error(YuStatus.InvalidParams));
        return;
      }
      const { account, password } = req.body;

      await UserModel.create({ account, password });

      res.json(Yu.success(null));
    })
  ).comment('注册');

  r.post(
    '/login',
    catchAsyncErr(async (req, res) => {
      const { account, password } = req.body;

      if (isEmpty(account) || isEmpty(password)) {
        res.json(Yu.error(YuStatus.InvalidParams));
        return;
      }

      const user = await UserModel.findOne({ where: { account, password } });

      if (!user) {
        res.json(Yu.error(YuStatus.NotExist));
        return;
      }

      const token = genJwt(user.id, user.account);

      res.cookie('token', token, { expires: cookieExpires });
      res.cookie('uid', user.id, { expires: cookieExpires });

      res.json(Yu.success(null));
    })
  ).comment('登录');

  r.post(
    '/update',
    catchAsyncErr(async (req, res) => {
      let { id, account, password } = req.body;
      id = Number(id);

      if (isNaN(id) || isEmpty(account) || isEmpty(password)) {
        res.json(Yu.error(YuStatus.InvalidParams));
        return;
      }

      await UserModel.update({ account, password }, { where: { id } });
      res.json(Yu.success(null));
    })
  ).comment('更新个人信息');
});
