import { createRouter } from '../common/createRouter';
import { isEmpty } from '../common/utils';
import { Yu, YuStatus } from '../common/yu';
import { PageModel, UserModel } from '../model';

export const PageController = createRouter('/page', (r) => {
  /**
   * 根据ID获取页面
   */
  r.get('/', async (req, res) => {
    const id = req.query.pageId;

    if (isEmpty(id)) {
      res.json(Yu.error(YuStatus.InvalidParams));
      return;
    }

    const page = await PageModel.findOne({ where: { id } });

    if (page.isDelete) {
      res.json(Yu.error(YuStatus.NotExist, '页面已被删除'));
      return;
    }
    res.json(Yu.success(page));
  });

  /**
   * 创建页面
   */
  r.post('/create', async (req, res) => {
    const page = req.body;
    const userId = req.body.userId;

    if (!PageModel.check(page)) {
      res.json(Yu.error(YuStatus.InvalidParams));
      return;
    }
    const user = await UserModel.findByPk(userId);
    const createdPage = await PageModel.create(page);
    await user.addPage(createdPage.id);

    res.json(Yu.success(null));
  });

  /**
   * 更新页面信息
   */
  r.post('/update.config', async (req, res) => {
    const { id, schema, name, description } = req.body;
    await PageModel.update({ schema, name, description }, { where: { id } });
  });

  /**
   * 更新页面发布状态
   */
  r.post('/update.publish', async (req, res) => {
    const { id, isPublish } = req.body;

    if (typeof isPublish === 'boolean') {
      res.json(Yu.error(YuStatus.InvalidParams));
      return;
    }

    await PageModel.update({ isPublish }, { where: { id } });
  });

  /**
   * 更新页面开放状态
   */
  r.post('/update.public', async (req, res) => {
    const { id, isPublic } = req.body;

    if (typeof isPublic === 'boolean') {
      res.json(Yu.error(YuStatus.InvalidParams));
      return;
    }

    await PageModel.update({ isPublic }, { where: { id } });
  });
});
