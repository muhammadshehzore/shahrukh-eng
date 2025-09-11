import redis
from django.conf import settings
from datetime import timedelta

def get_redis():
    try:
        location = settings.CACHES["default"]["LOCATION"]
        return redis.Redis.from_url(location, decode_responses=True)
    except Exception:
        return None  # fallback if needed

def add_online_user(username, expire_hours=24):
    r = get_redis()
    if not r: return
    r.sadd("online_users", username)
    r.expire("online_users", timedelta(hours=expire_hours))

def remove_online_user(username):
    r = get_redis()
    if not r: return
    r.srem("online_users", username)

def get_online_users():
    r = get_redis()
    if not r: return set()
    return r.smembers("online_users")
